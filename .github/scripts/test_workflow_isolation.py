from pathlib import Path
import unittest

import yaml


WORKFLOW = Path(__file__).resolve().parents[1] / 'workflows/develop.yml'


class RunnerIsolationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = yaml.safe_load(WORKFLOW.read_text(encoding='utf-8'))
        cls.jobs = cls.workflow['jobs']

    def test_product_tests_have_no_write_token_or_private_provider(self):
        for name in ('validate-proposal', 'validate-integration'):
            with self.subTest(job=name):
                job = self.jobs[name]
                self.assertNotIn('write', job['permissions'].values())
                self.assertNotIn('GH_TOKEN', job.get('env', {}))
                self.assertNotIn('secrets.', str(job))
                self.assertNotIn('bootstrap-private-ci', str(job))
                self.assertIn('npm test', str(job))

    def test_publishers_never_execute_product_code(self):
        for name in ('publish-proposal', 'publish-integration'):
            with self.subTest(job=name):
                job = self.jobs[name]
                self.assertNotIn('GH_TOKEN', job.get('env', {}))
                for step in job['steps']:
                    command = step.get('run', '')
                    self.assertNotIn('npm ', command)
                    self.assertNotIn('node ', command)
                    if 'GH_TOKEN' in step.get('env', {}):
                        self.assertIn('/var/lib/brd-ci-provider/bridge.py', command)

    def test_developer_cannot_write_github_or_run_validation_after_agent(self):
        job = self.jobs['develop']
        self.assertNotIn('write', job['permissions'].values())
        agent_index = next(i for i, s in enumerate(job['steps']) if s.get('id') == 'agent')
        self.assertNotIn('npm ', str(job['steps'][agent_index + 1:]))
        self.assertNotIn('GH_TOKEN', job.get('env', {}))

    def test_failed_validation_gets_diagnostics_not_publication(self):
        job = self.jobs['publish-proposal']
        self.assertIn("needs.validate-proposal.result == 'failure'", job['if'])
        finalize = next(s for s in job['steps'] if s.get('id') == 'finalize')
        self.assertIn("needs.validate-proposal.result == 'success'", finalize['if'])
        self.assertIn("steps.route.outputs.existing_pr == ''", finalize['if'])
        report = next(s for s in job['steps'] if s.get('name') == 'Report incomplete execution')
        self.assertIn('deterministic_tests_failed', report['env']['TERRA_REASON'])

    def test_integration_is_revisited_after_failure_without_a_new_pr(self):
        job = self.jobs['integration-plan']
        self.assertIn('always()', job['if'])
        self.assertIn("needs.develop.result != 'skipped'", job['if'])
        self.assertNotIn('pr_url', job['if'])
        self.assertNotIn("result == 'success'", job['if'])

    def test_exact_integration_commit_is_tested_then_rechecked_before_write(self):
        for name in ('validate-integration', 'publish-integration'):
            commands = '\n'.join(s.get('run', '') for s in self.jobs[name]['steps'])
            self.assertIn('git rev-parse FETCH_HEAD', commands)
            self.assertIn('git checkout --detach "$EXPECTED_INTEGRATION_SHA"', commands)
        self.assertIn("needs.validate-integration.result == 'success'", self.jobs['publish-integration']['if'])

    def test_proposal_uses_the_same_hash_and_base_in_qa_and_publication(self):
        for name in ('validate-proposal', 'publish-proposal'):
            env = self.jobs[name]['env']
            self.assertEqual(env['EXPECTED_BASE_SHA'], '${{ needs.develop.outputs.base_sha }}')
            self.assertEqual(env['EXPECTED_PATCH_SHA'], '${{ needs.develop.outputs.patch_sha }}')


if __name__ == '__main__':
    unittest.main()
