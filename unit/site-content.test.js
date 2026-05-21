const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("site entrypoints and brand documentation exist", () => {
  for (const file of [
    "index.html",
    "src/main.jsx",
    "src/styles.css",
    "docs/brand-references.md",
    "public/assets/brand/logo-full-dark.png",
    "public/assets/brand/logo-full-light.png",
    "public/assets/brand/hero-background.jpg",
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }
});

test("brand references capture the official identity signals", () => {
  const references = read("docs/brand-references.md");
  assert.match(references, /#964AFB/);
  assert.match(references, /Guiados pela tradição\. Impulsionados pela inovação\./);
  assert.match(references, /DM Sans/);
  assert.match(references, /Gupter/);
  assert.match(references, /C:\\Users\\Togszera\\Desktop\\BRD-identidade-visual/);
});

test("homepage contains the core BRD institutional content", () => {
  const app = read("src/main.jsx");
  for (const term of [
    "BRD Advocacia",
    "Expertises",
    "Nosso time",
    "Inteligência jurídica",
    "Recuperação de crédito",
    "Auditorias",
    "Adequação à LGPD",
    "Encarregado de dados",
    "Gestão de contratos",
    "Assessoria para licitações",
    "Treinamentos",
    "ESG",
  ]) {
    assert.match(app, new RegExp(term));
  }
  assert.match(app, /Prevenção/);
  assert.doesNotMatch(app, /Bernardo Advogados Associados/);
});

test("public assets in JSX respect the Vite base path", () => {
  const app = read("src/main.jsx");
  assert.match(app, /import\.meta\.env\.BASE_URL/);
  assert.doesNotMatch(app, /src="\/assets\/brand/);
});

test("frontend styling uses local assets and responsive safeguards", () => {
  const styles = read("src/styles.css");
  assert.match(styles, /@font-face/);
  assert.match(styles, /hero-background\.jpg/);
  assert.match(styles, /@media \(max-width: 720px\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /\.button:focus-visible/);
  assert.doesNotMatch(styles, /letter-spacing:\s*-/);
});

test("brand assets stay web friendly and chart stays lightweight", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.equal(packageJson.dependencies.recharts, undefined);
  assert.match(packageJson.scripts["build:pages"], /--base=\/brd-institucional\//);

  const maxBytesByAsset = {
    "public/assets/brand/hero-background.jpg": 450_000,
    "public/assets/brand/logo-full-dark.png": 140_000,
    "public/assets/brand/logo-full-light.png": 140_000,
    "public/assets/brand/icon-purple.png": 80_000,
  };

  for (const [file, maxBytes] of Object.entries(maxBytesByAsset)) {
    const size = fs.statSync(path.join(root, file)).size;
    assert.ok(size <= maxBytes, `${file} should stay under ${maxBytes} bytes`);
  }
});

test("github pages deployment builds the dist artifact", () => {
  const workflow = read(".github/workflows/pages.yml");
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path: dist/);
});
