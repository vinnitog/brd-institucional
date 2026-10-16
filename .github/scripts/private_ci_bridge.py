"""Small public adapter; implementation and prompts stay in the private provider."""
import hashlib
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
import tempfile

import yaml

ROOT = Path('/var/lib/brd-ci-provider')
CI_REF = '54e70eb28b8ea73a693676f09ed741f71ae5d86a'
REPOSITORY = 'vinnitog/brd-institucional'
SECRET_NAMES = ('GH_TOKEN', 'GITHUB_TOKEN', 'OPENAI_API_KEY', 'TRELLO_API_KEY', 'TRELLO_TOKEN')
PATCH_LIMIT = 50 * 1024 * 1024
JSON_LIMIT = 1024 * 1024
RESULT_FIELDS = ('summary', 'business_question', 'review_summary', 'qa_summary', 'ui_summary')
STATUSES = {'implemented', 'needs_review', 'already_implemented', 'failed'}
PROPOSAL_FILES = ('result.json', 'attempt.json', 'progress.json')
EXCLUDED_PATHS = ('.brd-agent', '.agents', '.claude', '.codex', '._brd_ci_bootstrap', '._utilities_bootstrap')


def run(*args, **kwargs):
    kwargs.setdefault('text', True)
    return subprocess.run(args, check=True, **kwargs)


def provider_access_check(root):
    if sys.platform != 'linux':
        raise RuntimeError('Provider access checks require Linux.')
    import grp
    import pwd

    uid, gid = os.getuid(), os.getgid()
    agent_gid = pwd.getpwnam('nobody').pw_gid
    if uid == 0 or gid == agent_gid or grp.getgrgid(agent_gid).gr_name not in {'nobody', 'nogroup'}:
        raise RuntimeError('Controller and agent must use distinct unprivileged groups.')
    for path in (root, *root.rglob('*')):
        info = path.lstat()
        expected = 0o750 if stat.S_ISDIR(info.st_mode) else 0o640
        if (not (stat.S_ISDIR(info.st_mode) or stat.S_ISREG(info.st_mode))
                or info.st_uid != 0 or info.st_gid != gid or stat.S_IMODE(info.st_mode) != expected):
            raise RuntimeError('Private provider ownership or access mode is unsafe.')
    files = [root / name for name in ('bridge.py', 'target.head', 'target.gitconfig', 'codex-bounded/run.py')]
    if not all(os.access(path, os.R_OK) for path in files):
        raise RuntimeError('Controller cannot read the private provider.')
    # The pinned Linux helper keeps the runner UID but uses nobody's GID and no groups.
    probe = '''import os, sys
uid, gid = map(int, sys.argv[1:3])
if (os.getuid(), os.geteuid(), os.getgid(), os.getegid(), os.getgroups()) != (uid, uid, gid, gid, []):
    raise SystemExit('Unexpected probe credentials')
for path in sys.argv[3:]:
    if os.access(path, os.R_OK | os.X_OK) or os.access(path, os.R_OK):
        raise SystemExit('Agent can access the private provider')
    try:
        with open(path, 'rb'):
            pass
    except PermissionError:
        continue
    raise SystemExit('Agent can open the private provider')
'''
    run('/usr/bin/sudo', '-n', '/usr/bin/setpriv', f'--reuid={uid}', f'--regid={agent_gid}',
        '--clear-groups', '--no-new-privs', '--bounding-set=-all', '--inh-caps=-all',
        '--ambient-caps=-all', '--', sys.executable, '-I', '-c', probe, str(uid), str(agent_gid),
        *(str(path) for path in files), env={'PATH': os.defpath, 'LANG': 'C.UTF-8'})


def trusted_root():
    if os.name != 'posix' or ROOT.resolve() != ROOT:
        raise RuntimeError('Private provider must use the protected Linux path.')
    for directory in (ROOT.parent, ROOT):
        info = directory.stat()
        if info.st_uid != 0 or info.st_mode & (stat.S_IWGRP | stat.S_IWOTH):
            raise RuntimeError(f'Unprotected provider directory: {directory}; uid={info.st_uid}, mode={stat.S_IMODE(info.st_mode):04o}.')
    actual = run('git', '-c', f'safe.directory={ROOT}', '-C', str(ROOT), 'rev-parse', 'HEAD', capture_output=True).stdout.strip()
    if actual != CI_REF:
        raise RuntimeError('Private provider commit differs from the audited pin.')
    return ROOT


def issue_number():
    value = os.environ.get('ISSUE_NUMBER', '')
    if not re.fullmatch(r'[1-9][0-9]*', value):
        raise ValueError('Invalid issue number.')
    if os.environ.get('GITHUB_REPOSITORY', '').lower() != REPOSITORY:
        raise ValueError('Unexpected target repository.')
    return value


def output(name, value):
    with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as stream:
        stream.write(f'{name}={value}\n')


def helper(root, directory, file, *args, env=None):
    return run(sys.executable, '-I', str(root / directory / file), *args, env=env)


def route(root):
    number = issue_number()
    issue = json.loads(run('gh', 'issue', 'view', number, '--repo', os.environ['GITHUB_REPOSITORY'],
                          '--json', 'number,title,body,comments,labels,state', capture_output=True).stdout)
    actionable = issue['state'] == 'OPEN' and not any(x['name'] == 'necessita-revisao' for x in issue['labels'])
    output('actionable', str(actionable).lower())
    if not actionable:
        return
    helper(root, 'integrate-prs', 'integrate.py', 'existing')
    directory = Path('.brd-agent')
    if directory.is_symlink():
        raise RuntimeError('Agent context must not be redirected.')
    directory.mkdir(exist_ok=True)
    (directory / 'issue.json').write_text(json.dumps(issue, ensure_ascii=True), encoding='utf-8')
    with open('.git/info/exclude', 'a', encoding='utf-8') as stream:
        stream.write('\n.brd-agent/\n.agents/skills/\n')


def agent_environment(root):
    number = issue_number()
    document = yaml.safe_load((root / '.github/workflows/codex-develop-attempt.yml').read_text(encoding='utf-8'))
    step = next(s for s in document['jobs']['develop']['steps'] if s.get('id') == 'codex')
    options = step['with']
    prompt = options['prompt'].replace('${{ inputs.issue_number }}', number)
    if '${{' in prompt or not isinstance(json.loads(options['output-schema']), dict):
        raise ValueError('Unsupported private prompt contract.')
    env = os.environ.copy()
    for key in SECRET_NAMES:
        env.pop(key, None)
    env.update(BRD_PROMPT=prompt, BRD_SCHEMA=options['output-schema'], BRD_MODEL='gpt-5.6-terra',
               BRD_EFFORT='low', BRD_TIMEOUT='900', BRD_OUTPUT='.brd-agent/result.json')
    return env


def safe_git_environment():
    env = os.environ.copy()
    for key in ('GIT_DIR', 'GIT_COMMON_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
                'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG', 'GIT_CONFIG_PARAMETERS',
                'GIT_SHALLOW_FILE', 'GIT_NAMESPACE'):
        env.pop(key, None)
    env.update(GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM='1', GIT_CONFIG_COUNT='5',
               GIT_NO_REPLACE_OBJECTS='1', GIT_GRAFT_FILE=os.devnull,
               GIT_CONFIG_KEY_0='core.hooksPath', GIT_CONFIG_VALUE_0=os.devnull,
               GIT_CONFIG_KEY_1='credential.helper', GIT_CONFIG_VALUE_1='',
               GIT_CONFIG_KEY_2='credential.helper', GIT_CONFIG_VALUE_2='!gh auth git-credential',
               GIT_CONFIG_KEY_3='remote.origin.url',
               GIT_CONFIG_VALUE_3='https://github.com/' + os.environ['GITHUB_REPOSITORY'] + '.git',
               GIT_CONFIG_KEY_4='commit.gpgsign', GIT_CONFIG_VALUE_4='false')
    return env


def protected_path(path):
    return path.replace('\\', '/').split('/')[0] == '.github'


def trusted_snapshot(root):
    if sys.platform != 'linux' or root != ROOT or root.resolve() != root:
        raise RuntimeError('Export requires the protected Linux snapshot.')
    for directory in (root.parent, root):
        info = directory.lstat()
        if not stat.S_ISDIR(info.st_mode) or info.st_uid != 0 or info.st_mode & 0o022:
            raise RuntimeError('Snapshot directory is not protected.')
    for name in ('target.head', 'target.gitconfig'):
        info = (root / name).lstat()
        if (not stat.S_ISREG(info.st_mode) or info.st_uid != 0 or info.st_gid != os.getgid()
                or stat.S_IMODE(info.st_mode) != 0o640):
            raise RuntimeError('Snapshot file is not protected.')
    base = read_file(root / 'target.head', 41).decode('ascii').strip()
    require_hash(base, 40)
    return base


def publication_environment(root):
    # Never execute agent-written Git hooks, filters or credential helpers with a token.
    git_dir = Path('.git')
    config = git_dir / 'config'
    if git_dir.is_symlink() or not git_dir.is_dir() or config.is_symlink():
        raise RuntimeError('Git metadata was redirected by the agent.')
    config.write_bytes((root / 'target.gitconfig').read_bytes())
    env = safe_git_environment()
    base = (root / 'target.head').read_text(encoding='ascii').strip()
    require_hash(base, 40)
    run('git', 'merge-base', '--is-ancestor', base, 'HEAD', env=env)
    history = run('git', 'log', '--format=', '--name-only', '-z', '--no-renames', '--full-history',
                  '-m', f'{base}..HEAD', '--', '.github', env=env, capture_output=True).stdout
    if history.strip('\0\n'):
        raise RuntimeError('The agent committed changes to protected automation files.')
    commands = [('git', 'diff', '--no-renames', '--name-only', '-z'),
                ('git', 'diff', '--cached', '--no-renames', '--name-only', '-z'),
                ('git', 'ls-files', '--others', '--exclude-standard', '-z')]
    for command in commands:
        paths = run(*command, env=env, capture_output=True).stdout.split('\0')
        if any(protected_path(p) for p in paths):
            raise RuntimeError('The agent changed protected automation files.')
    return env


def require_hash(value, length):
    if not isinstance(value, str) or not re.fullmatch(r'[a-f0-9]{' + str(length) + '}', value):
        raise ValueError('Invalid proposal hash.')


def read_file(path, limit):
    info = path.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_size > limit:
        raise ValueError('Proposal file must be a bounded regular file.')
    with path.open('rb') as stream:
        data = stream.read(limit + 1)
    if len(data) > limit:
        raise ValueError('Proposal file exceeds its size limit.')
    return data


def read_json(path):
    value = json.loads(read_file(path, JSON_LIMIT).decode('utf-8'),
                       parse_constant=invalid_json_number)
    if not isinstance(value, dict):
        raise ValueError('Proposal JSON must be an object.')
    return value


def invalid_json_number(value):
    raise ValueError('Invalid JSON number.')


def write_json(path, value):
    data = json.dumps(value, ensure_ascii=True, allow_nan=False).encode('utf-8')
    if len(data) > JSON_LIMIT:
        raise ValueError('Serialized proposal JSON exceeds its size limit.')
    with path.open('xb') as stream:
        stream.write(data)


def result_files(directory, fallback=False):
    if directory.is_symlink():
        raise ValueError('Result directory must not be redirected.')
    files = {}
    for name in PROPOSAL_FILES:
        path = directory / name
        if path.exists() or path.is_symlink():
            files[name] = read_json(path)
    if 'result.json' not in files and fallback:
        files['result.json'] = {'status': 'failed', **{key: '' for key in RESULT_FIELDS},
                                'summary': 'No structured result was produced.'}
    result = files.get('result.json', {})
    if (set(result) != {'status', *RESULT_FIELDS} or not isinstance(result.get('status'), str)
            or result['status'] not in STATUSES
            or not all(isinstance(result[key], str) for key in RESULT_FIELDS)):
        raise ValueError('Invalid structured proposal result.')
    return files


def proposal_directory():
    directory = Path(os.environ['RUNNER_TEMP']) / 'brd-proposal'
    if directory.is_symlink():
        raise ValueError('Proposal directory must not be redirected.')
    return directory


def forbidden_proposal_path(path):
    normalized = path.replace('\\', '/')
    first = normalized.split('/')[0]
    return (protected_path(path) or first in ('.git', *EXCLUDED_PATHS)
            or (first == '.env' or first.startswith('.env.')) and first != '.env.example'
            or normalized.endswith(('.pem', '.key')))


def check_index(base, env):
    paths = run('git', 'diff', '--cached', '--no-renames', '--name-only', '-z', base, '--',
                env=env, capture_output=True).stdout.split('\0')
    if any(forbidden_proposal_path(path) for path in paths if path):
        raise ValueError('Proposal changes a protected or private path.')


def write_patch(path, base, env):
    command = ['git', 'diff', '--cached', '--binary', '--full-index', '--no-ext-diff',
               '--no-textconv', '--no-renames', base, '--']
    digest, size = hashlib.sha256(), 0
    with path.open('xb') as stream, subprocess.Popen(command, env=env, stdout=subprocess.PIPE,
                                                   stderr=subprocess.DEVNULL) as process:
        try:
            while chunk := process.stdout.read(1024 * 1024):
                size += len(chunk)
                if size > PATCH_LIMIT:
                    raise ValueError('Proposal patch exceeds 50 MB.')
                digest.update(chunk)
                stream.write(chunk)
            if process.wait():
                raise RuntimeError('Could not export the proposal patch.')
        finally:
            if process.poll() is None:
                process.kill()
                process.wait()
    return digest.hexdigest()


def proposal_outputs(metadata):
    for key in ('base_sha', 'patch_sha256', 'status'):
        output(key, metadata[key])


def export_proposal(root):
    number = issue_number()
    base = trusted_snapshot(root)
    env = publication_environment(root)
    files = result_files(Path('.brd-agent'), fallback=True)
    directory = proposal_directory()
    directory.mkdir(exist_ok=False)
    with tempfile.TemporaryDirectory(dir=os.environ['RUNNER_TEMP'], prefix='brd-index-') as temporary:
        env['GIT_INDEX_FILE'] = str(Path(temporary) / 'index')
        run('git', 'read-tree', base, env=env)
        run('git', 'add', '--all', '--', '.', *(f':(exclude){path}' for path in EXCLUDED_PATHS), env=env)
        check_index(base, env)
        patch_sha = write_patch(directory / 'code.patch', base, env)
    metadata = {'base_sha': base, 'issue_number': number, 'repository': REPOSITORY,
                'patch_sha256': patch_sha, 'status': files['result.json']['status']}
    for name, value in (*files.items(), ('metadata.json', metadata)):
        write_json(directory / name, value)
    if {path.name for path in directory.iterdir()} != {'code.patch', 'metadata.json', *files}:
        raise ValueError('Unexpected proposal artifact files.')
    proposal_outputs(metadata)


def apply_proposal():
    number = issue_number()
    base, expected_hash = os.environ['EXPECTED_BASE_SHA'], os.environ['EXPECTED_PATCH_SHA']
    require_hash(base, 40)
    require_hash(expected_hash, 64)
    directory = proposal_directory()
    if not directory.is_dir() or not {path.name for path in directory.iterdir()} <= {
            'code.patch', 'metadata.json', *PROPOSAL_FILES}:
        raise ValueError('Unexpected proposal artifact files.')
    metadata = read_json(directory / 'metadata.json')
    files = result_files(directory)
    expected = {'base_sha': base, 'issue_number': number, 'repository': REPOSITORY,
                'patch_sha256': expected_hash, 'status': files['result.json']['status']}
    if metadata != expected:
        raise ValueError('Proposal metadata does not match the trusted inputs.')
    patch = directory / 'code.patch'
    if hashlib.sha256(read_file(patch, PATCH_LIMIT)).hexdigest() != expected_hash:
        raise ValueError('Proposal patch hash mismatch.')
    env = safe_git_environment()
    if run('git', 'rev-parse', 'HEAD', env=env, capture_output=True).stdout.strip() != base:
        raise ValueError('Proposal must be applied to the exact expected base.')
    run('git', 'diff', '--exit-code', env=env, capture_output=True)
    run('git', 'diff', '--cached', '--exit-code', env=env, capture_output=True)
    destination = Path('.brd-agent')
    if destination.is_symlink() or destination.exists() and not destination.is_dir():
        raise ValueError('Result destination must not be redirected.')
    if any((destination / name).exists() or (destination / name).is_symlink() for name in files):
        raise ValueError('Proposal result files must not overwrite existing files.')
    if patch.stat().st_size:
        with tempfile.TemporaryDirectory(dir=os.environ['RUNNER_TEMP'], prefix='brd-index-') as temporary:
            index_env = {**env, 'GIT_INDEX_FILE': str(Path(temporary) / 'index')}
            run('git', 'read-tree', base, env=index_env)
            run('git', 'apply', '--cached', '--binary', str(patch), env=index_env)
            check_index(base, index_env)
        run('git', 'apply', '--index', '--binary', str(patch), env=env)
        check_index(base, env)
    destination.mkdir(exist_ok=True)
    for name, value in files.items():
        write_json(destination / name, value)
    proposal_outputs(metadata)


def main(mode):
    if mode == 'export-proposal':
        export_proposal(ROOT)
        return
    if mode == 'apply-proposal':
        apply_proposal()
        return
    root = trusted_root()
    issue_number()
    if mode == 'provider-check':
        agent_environment(root)
        provider_access_check(root)
        print('Private provider and prompt contract validated. No model or Issue was executed.')
    elif mode == 'route':
        route(root)
    elif mode == 'documents':
        helper(root, 'ticket-documents', 'download.py', '--issue', '.brd-agent/issue.json', '--output', '.brd-agent/documents')
    elif mode == 'agent':
        provider_access_check(root)
        helper(root, 'codex-bounded', 'run.py', env=agent_environment(root))
    elif mode == 'classify':
        helper(root, 'codex-bounded', 'escalation.py')
    elif mode == 'finalize':
        helper(root, 'develop-result', 'finalize.py', env=publication_environment(root))
    elif mode == 'diagnostic':
        helper(root, 'develop-diagnostics', 'report.py')
    elif mode in {'prepare', 'verify', 'publish', 'merge', 'promote'}:
        helper(root, 'integrate-prs', 'integrate.py', mode)
    else:
        raise ValueError('Unsupported adapter mode.')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('One adapter mode is required.')
    main(sys.argv[1])
