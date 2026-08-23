const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function listReviewableTextFiles(directory = root) {
  const excludedDirectories = new Set([".agents", ".git", "dist", "node_modules"]);
  const textExtensions = new Set([
    ".cmd",
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".txt",
    ".yaml",
    ".yml",
  ]);
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        files.push(...listReviewableTextFiles(path.join(directory, entry.name)));
      }
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (textExtensions.has(extension) || entry.name === ".gitignore" || entry.name.startsWith(".env")) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

test("workflow kit files exist", () => {
  for (const file of ["AGENTS.md", "CLAUDE.md", "PROJECT_CONTEXT.md", "SKILLS_PROFILE.md", "README.md", "test.cmd", "package.json", ".gitignore"]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }
});

test("codex and claude share the mandatory workflow", () => {
  const agents = read("AGENTS.md");
  const claude = read("CLAUDE.md");
  for (const content of [agents, claude]) {
    const order = ["senior-dev", "ui-ux-expert", "code-reviewer", "qa-senior", "qa-automate"];
    let lastIndex = -1;
    for (const step of order) {
      const index = content.indexOf(step);
      assert.ok(index > lastIndex, `${step} should appear after the previous workflow step`);
      lastIndex = index;
    }
    assert.match(content, /develop/);
    assert.match(content, /Nunca.*push direto.*main|Nunca faca push direto para `main`/s);
  }
});

test("frontend work requires ui ux review", () => {
  const agents = read("AGENTS.md");
  const claude = read("CLAUDE.md");
  assert.match(agents, /qualquer ajuste de front-end deve acionar `ui-ux-expert`/);
  assert.match(claude, /qualquer mudanca de front-end deve passar por avaliacao UI\/UX/);
});

test("browser blocked by client policy is documented", () => {
  const agents = read("AGENTS.md");
  const claude = read("CLAUDE.md");
  for (const content of [agents, claude]) {
    assert.match(content, /ERR_BLOCKED_BY_CLIENT/);
    assert.match(content, /file:\/\//);
    assert.match(content, /localhost/);
    assert.match(content, /127\.0\.0\.1/);
  }
});

test("project context records stack decision", () => {
  const context = read("PROJECT_CONTEXT.md");
  assert.match(context, /## Stack Escolhida/);
  assert.match(context, /## Motivo Da Stack/);
  assert.match(context, /## Alternativas Rejeitadas/);
  assert.match(context, /Revisao Obrigatoria De Stack/);
});

test("public workflow files do not expose an absolute developer path", () => {
  for (const file of ["AGENTS.md", "CLAUDE.md", "PROJECT_CONTEXT.md", "SKILLS_PROFILE.md", "README.md", "docs/brand-references.md"]) {
    assert.doesNotMatch(read(file), /C:\\Users\\/i, `${file} should not expose a local Windows user path`);
  }
});

test("current reviewable tree does not expose common sensitive values", () => {
  const patterns = [
    { label: "personal Gmail address", expression: /[\w.+-]+@gmail\.com/i },
    { label: "absolute Windows user path", expression: /[A-Z]:\\Users\\[^\\\r\n]+\\/i },
    { label: "private key material", expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
    {
      label: "hardcoded Vite credential",
      expression: /VITE_[A-Z0-9_]*(?:SECRET|TOKEN|ACCESS_KEY|PASSWORD)\s*=/i,
    },
  ];

  for (const absoluteFile of listReviewableTextFiles()) {
    const content = fs.readFileSync(absoluteFile, "utf8");
    const relativeFile = path.relative(root, absoluteFile);
    for (const { label, expression } of patterns) {
      assert.doesNotMatch(content, expression, `${relativeFile} should not contain ${label}`);
    }
  }
});

test("vendored skills include their complete LGPD dependency set and licenses", () => {
  const lgpdSkills = [
    "audit",
    "legal-basis",
    "data-mapping",
    "ropa",
    "ripd",
    "consent-schema",
    "dsar",
    "privacy-policy",
    "incident-response",
    "dpo-encarregado",
    "dpa",
    "international-transfer",
    "vendor-audit",
    "audit-logging",
    "encryption-keys",
    "anonymization",
    "retention-erasure",
    "eca-digital-minors",
    "legacy-retrofit",
  ];

  for (const skill of lgpdSkills) {
    assert.ok(fs.existsSync(path.join(root, ".agents", "skills", `lgpd-${skill}`, "SKILL.md")));
  }

  for (const file of [
    ".agents/skills/impeccable/SKILL.md",
    "third_party/lgpd-skills-LICENSE.txt",
    "third_party/impeccable-LICENSE.txt",
    "third_party/impeccable-NOTICE.md",
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }
});

test("LGPD audit artifacts match the reported completed stages", () => {
  for (const file of [
    ".lgpd/STATUS.md",
    ".lgpd/discovery.md",
    ".lgpd/gaps.md",
    ".lgpd/data-map.md",
    ".lgpd/legal-basis.md",
    ".lgpd/policies/privacy-policy-v1.0-draft.md",
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }

  const status = read(".lgpd/STATUS.md");
  assert.match(status, /3 atividades/);
  assert.match(status, /nenhuma aprovada/);
  assert.match(status, /revisão jurídica/i);
});

test("LGPD policy and legal bases remain explicit unapproved drafts", () => {
  const policiesDirectory = path.join(root, ".lgpd", "policies");
  const policyFiles = fs.readdirSync(policiesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  assert.deepEqual(policyFiles, ["privacy-policy-v1.0-draft.md"]);

  const policy = read(`.lgpd/policies/${policyFiles[0]}`);
  assert.match(policy, /RASCUNHO PARA REVISÃO JURÍDICA — NÃO PUBLICAR/);
  assert.match(policy, /Vigência.*pendente de aprovação/);
  assert.match(policy, /\[VALIDAR(?:[^\]]*)\]/);

  const legalBasis = read(".lgpd/legal-basis.md");
  assert.match(legalBasis, /v0\.1-draft/);
  assert.match(legalBasis, /nenhuma decisão abaixo deve ser tratada como aprovação final/);
  assert.match(legalBasis, /Bases aprovadas: 0/);

  const status = read(".lgpd/STATUS.md");
  assert.match(status, /- \[ \] Checkpoint — revisão jurídica/);
  assert.match(status, /rascunho, não publicado/i);
});

