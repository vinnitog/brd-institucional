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
  assert.match(references, /Maria foi removida da seção de sócios/);
});

test("homepage contains the core BRD institutional content", () => {
  const app = read("src/main.jsx");
  for (const term of [
    "BRD Advocacia",
    "Expertises",
    "Sócios",
    "Inteligência jurídica",
    "Recuperação de crédito",
    "Auditorias",
    "Adequação à LGPD",
    "Encarregado de dados",
    "Gestão de contratos",
    "Assessoria para licitações",
    "Treinamentos",
    "ESG",
    "Luís Bernardo Júnior",
    "Letícia Barriento",
    "André Luis",
    "Fernanda",
    "Rua Sete de Setembro",
    "Marília/SP",
    "17502-020",
    "Redes sociais",
  ]) {
    assert.match(app, new RegExp(term));
  }
  assert.match(app, /Prevenção/);
  assert.match(app, /menu-toggle/);
  assert.match(app, /aria-expanded=\{isMenuOpen\}/);
  assert.match(app, /id="main-navigation"/);
  assert.match(app, /href="#socios"/);
  assert.match(app, /id="socios"/);
  assert.match(app, /href="#sobre"[\s\S]*href="#socios"[\s\S]*href="#expertises"/);
  assert.doesNotMatch(app, /href="#equipe"|id="equipe"/);
  assert.match(app, /https:\/\/www\.instagram\.com\/brd\.adv\//);
  assert.match(app, /linkedin\.com\/company\/bernardo-advogados-associados-brd/);
  assert.match(app, /youtube\.com\/channel\/UCBEoHdFSNDyOLZkpyo5bTLg/);
  assert.match(app, /facebook\.com\/people\/Bernardo-Advogados-Associados/);
  assert.match(app, /google\.com\/maps\/search/);
  assert.match(app, /tel:\+5514998325395/);
  assert.match(app, /mailto:contato@brd\.adv\.br/);
  assert.match(app, /function MapPinIcon/);
  assert.match(app, /function SocialIcon/);
  assert.match(app, /icon: "instagram"/);
  assert.match(app, /icon: "linkedin"/);
  assert.match(app, /icon: "youtube"/);
  assert.match(app, /icon: "facebook"/);
  assert.match(app, /aria-label="Redes sociais do BRD"/);
  assert.match(app, /className="footer-route"[\s\S]*href=\{mapUrl\}/);
  assert.match(app, /className="social-link"/);
  assert.doesNotMatch(app, /Abrir rota no Google Maps/);
  assert.doesNotMatch(app, /name: "Maria"/);
  assert.match(app, /target="_blank"\s+rel="noreferrer"/);
  assert.match(app, /O BRD une experiência jurídica/);
  assert.match(app, /className="sr-only">Guiados pela tradição\. Impulsionados pela inovação\./);
  assert.doesNotMatch(app, /O visual do site segue a marca oficial/);
  assert.doesNotMatch(app, /Nosso time/);
  assert.doesNotMatch(app, /<p className="hero-lead">/);
  assert.doesNotMatch(app, /className="hero-logo"/);
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
  assert.match(styles, /\.menu-toggle/);
  assert.match(styles, /nav\.is-open/);
  assert.match(styles, /\.partners-grid/);
  assert.match(styles, /\.partner-card/);
  assert.match(styles, /\.footer-grid/);
  assert.match(styles, /\.footer-social/);
  assert.match(styles, /\.site-header nav/);
  assert.match(styles, /\.footer-route svg/);
  assert.match(styles, /\.social-link svg/);
  assert.match(styles, /\.social-link\s*\{[\s\S]*min-height: 44px/);
  assert.doesNotMatch(styles, /\.footer-social a\s*\{[^}]*min-height:\s*auto/);
  assert.match(styles, /\.partners-heading\s*\{[\s\S]*max-width: 980px/);
  assert.doesNotMatch(styles, /\.partners-heading\s*\{[^}]*display:\s*grid/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.hero\s*\{[\s\S]*align-items: center/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.hero\s*\{[\s\S]*min-height: min\(700px, calc\(90svh - 76px\)\)/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partners-grid\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-card\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(styles, /center center \/ cover/);
  assert.match(styles, /font-size: clamp\(3rem, 12vw, 4\.2rem\)/);
  assert.match(styles, /scroll-padding-top: 96px/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /\.button:focus-visible/);
  assert.match(styles, /\.menu-toggle:focus-visible/);
  assert.match(styles, /animation-delay: 0\.01ms !important/);
  assert.doesNotMatch(styles, /overflow-x: auto/);
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
