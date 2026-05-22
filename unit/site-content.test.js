const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const root = path.join(__dirname, "..");

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function importModule(file) {
  return import(pathToFileURL(path.join(root, file)).href);
}

test("site entrypoints and brand documentation exist", () => {
  for (const file of [
    "index.html",
    "src/main.jsx",
    "src/styles.css",
    "docs/brand-references.md",
    "public/assets/brand/logo-full-dark.png",
    "public/assets/brand/logo-full-light.png",
    "public/assets/brand/brd-mascot-b.svg",
    "public/assets/brand/hero-background.jpg",
    "public/assets/brand/partners/luis.jpg",
    "public/assets/brand/partners/leticia.jpg",
    "public/assets/brand/partners/andre.jpg",
    "public/assets/brand/partners/fernanda.jpg",
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
  assert.match(references, /Mascote BRD/);
  assert.match(references, /brd-mascot-b\.svg/);
  assert.match(references, /futuro chatbot/);
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
    "Fernanda Félix",
    "Rua Sete de Setembro",
    "Marília/SP",
    "17502-020",
    "Redes sociais",
    "Fale comigo!",
    "Atendimento inicial",
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
  assert.match(app, /assets\/brand\/partners\/luis\.jpg/);
  assert.match(app, /assets\/brand\/partners\/leticia\.jpg/);
  assert.match(app, /assets\/brand\/partners\/andre\.jpg/);
  assert.match(app, /assets\/brand\/partners\/fernanda\.jpg/);
  assert.match(app, /alt=\{`Foto de \$\{partner\.name\}`\}/);
  assert.match(app, /loading="lazy"/);
  assert.doesNotMatch(app, /href="#equipe"|id="equipe"/);
  assert.match(app, /https:\/\/www\.instagram\.com\/brd\.adv\//);
  assert.match(app, /linkedin\.com\/company\/bernardo-advogados-associados-brd/);
  assert.match(app, /youtube\.com\/channel\/UCBEoHdFSNDyOLZkpyo5bTLg/);
  assert.match(app, /facebook\.com\/people\/Bernardo-Advogados-Associados/);
  assert.match(app, /google\.com\/maps\/search/);
  assert.match(app, /tel:\+5514998325395/);
  assert.match(app, /import \{ buildEmailComposerUrl \} from "\.\/emailLinks\.mjs";/);
  assert.match(app, /href=\{buildEmailComposerUrl\(contactEmail, contactEmailSubject, contactEmailBody\)\}/);
  assert.match(app, /mailto:\$\{contactEmail\}/);
  assert.match(app, /contactEmail = "contato@brd\.adv\.br"/);
  assert.match(app, /chatAnalysisEmail = "vinnitog@gmail\.com"/);
  assert.match(app, /function MapPinIcon/);
  assert.match(app, /function SocialIcon/);
  assert.match(app, /icon: "instagram"/);
  assert.match(app, /icon: "linkedin"/);
  assert.match(app, /icon: "youtube"/);
  assert.match(app, /icon: "facebook"/);
  assert.match(app, /aria-label="Redes sociais do BRD"/);
  assert.match(app, /className="footer-route"[\s\S]*href=\{mapUrl\}/);
  assert.match(app, /className="social-link"/);
  assert.doesNotMatch(app, /contact-actions[\s\S]*instagram\.com\/brd\.adv/);
  assert.doesNotMatch(app, /Abrir Instagram/);
  assert.match(app, /function LegalContactChat/);
  assert.match(app, /className=\{`legal-chat \$\{isOpen \? "is-open" : ""\}`\}/);
  assert.match(app, /assets\/brand\/brd-mascot-b\.svg/);
  assert.match(app, /aria-controls="legal-chat-panel"/);
  assert.match(app, /aria-label="Atendimento inicial BRD"/);
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

test("homepage offers a legally safe guided first-contact chat", () => {
  const app = read("src/main.jsx");

  for (const term of [
    "function LegalContactChat",
    "Fale comigo!",
    "Atendimento inicial",
    "Este canal não substitui consulta jurídica",
    "não analisa documentos",
    "não antecipa resultado",
    "Evite enviar dados sensíveis",
    "Enviar para análise",
    "Um novo contato foi iniciado pelo chatbot do site.",
    "[Site BRD] Novo contato",
    "Dados do contato",
    "Observação de segurança",
    "VITE_CONTACT_FORM_ENDPOINT",
    "VITE_CONTACT_FORM_ACCESS_KEY",
    "window.location.href = buildEmailComposerUrl(chatAnalysisEmail",
  ]) {
    assert.match(app, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const field of [
    'name="name"',
    'name="email"',
    'name="phone"',
    'name="topic"',
    'name="message"',
    'name="schedule"',
  ]) {
    assert.match(app, new RegExp(field));
  }

  assert.match(app, /fetch\(chatFormEndpoint/);
  assert.match(app, /to_email: chatAnalysisEmail/);
  assert.doesNotMatch(app, /to_email: contactEmail/);
  assert.doesNotMatch(app, /buildEmailComposerUrl\(contactEmail, subject, emailBody\)/);
  assert.match(app, /reply_to: form\.email/);
  assert.match(app, /buildChatEmailBody/);
  assert.match(app, /brd-mascot-b\.svg/);
  assert.match(app, /Melhor período para retorno/);
  assert.match(app, /placeholder="Ex\.: manhã, tarde ou dia específico"/);
  assert.doesNotMatch(app, /Use o e-mail \$\{chatAnalysisEmail\}/);
  assert.doesNotMatch(app, /indeniza[cç][aã]o garantida|caso ganho|resultado garantido/i);
});

test("email composer links encode recipients, subjects and bodies", async () => {
  const { buildEmailComposerUrl } = await importModule("src/emailLinks.mjs");

  assert.equal(
    buildEmailComposerUrl("contato@brd.adv.br", "Contato pelo site BRD", "Linha 1\nLinha 2"),
    "mailto:contato@brd.adv.br?subject=Contato%20pelo%20site%20BRD&body=Linha%201%0ALinha%202",
  );
  assert.equal(
    buildEmailComposerUrl("vinnitog@gmail.com", "Análise jurídica", "Dados com acento"),
    "mailto:vinnitog@gmail.com?subject=An%C3%A1lise%20jur%C3%ADdica&body=Dados%20com%20acento",
  );
  assert.equal(buildEmailComposerUrl("contato@brd.adv.br"), "mailto:contato@brd.adv.br");
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
  assert.match(styles, /\.partner-photo/);
  assert.match(styles, /object-fit: cover/);
  assert.match(styles, /object-position: center top/);
  assert.match(styles, /\.footer-grid/);
  assert.match(styles, /\.footer-social/);
  assert.match(styles, /\.site-header nav/);
  assert.match(styles, /\.footer-route svg/);
  assert.match(styles, /\.social-link svg/);
  assert.match(styles, /\.legal-chat\s*\{/);
  assert.match(styles, /\.legal-chat-toggle/);
  assert.match(styles, /\.legal-chat-panel/);
  assert.match(styles, /\.legal-chat-toggle-icon img/);
  assert.match(styles, /\.legal-chat-feedback\.sent/);
  assert.match(styles, /\.social-link\s*\{[\s\S]*min-height: 44px/);
  assert.match(styles, /\.legal-chat\s*\{[\s\S]*display: contents/);
  assert.match(styles, /\.legal-chat-toggle\s*\{[\s\S]*position: fixed/);
  assert.match(styles, /\.legal-chat-toggle\s*\{[\s\S]*top: 50%/);
  assert.match(styles, /\.legal-chat-toggle\s*\{[\s\S]*right: 0/);
  assert.match(styles, /\.legal-chat-panel\s*\{[\s\S]*position: fixed/);
  assert.match(styles, /\.legal-chat-panel\s*\{[\s\S]*right: 0/);
  assert.match(styles, /\.legal-chat-panel\s*\{[\s\S]*max-height: min\(620px, calc\(100svh - 48px\)\)/);
  assert.match(styles, /\.legal-chat-panel\s*\{[\s\S]*overflow: auto/);
  assert.match(styles, /@keyframes mascotWave/);
  assert.match(styles, /animation: mascotWave/);
  assert.match(styles, /\.legal-chat\.is-open \.legal-chat-toggle\s*\{[\s\S]*display: none/);
  assert.match(styles, /\.legal-chat-form input,\s*\.legal-chat-form select,\s*\.legal-chat-form textarea/);
  assert.doesNotMatch(styles, /\.legal-chat-form\s*\{[^}]*overflow: auto/);
  assert.doesNotMatch(styles, /\.footer-social a\s*\{[^}]*min-height:\s*auto/);
  assert.match(styles, /\.partners-heading\s*\{[\s\S]*max-width: 980px/);
  assert.doesNotMatch(styles, /\.partners-heading\s*\{[^}]*display:\s*grid/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.hero\s*\{[\s\S]*align-items: center/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.hero\s*\{[\s\S]*min-height: min\(700px, calc\(90svh - 76px\)\)/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partners-grid\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-card\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-photo\s*\{[\s\S]*height: auto/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-photo\s*\{[\s\S]*max-width: 260px/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-photo img\s*\{[\s\S]*object-fit: contain/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.partner-card\s*\{[\s\S]*max-width: 360px/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.legal-chat-panel\s*\{[\s\S]*left: auto/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.legal-chat-panel\s*\{[\s\S]*max-height: min\(620px, calc\(100svh - 64px\)\)/);
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
    "public/assets/brand/brd-mascot-b.svg": 40_000,
    "public/assets/brand/icon-purple.png": 80_000,
    "public/assets/brand/partners/luis.jpg": 80_000,
    "public/assets/brand/partners/leticia.jpg": 80_000,
    "public/assets/brand/partners/andre.jpg": 80_000,
    "public/assets/brand/partners/fernanda.jpg": 80_000,
  };

  for (const [file, maxBytes] of Object.entries(maxBytesByAsset)) {
    const size = fs.statSync(path.join(root, file)).size;
    assert.ok(size <= maxBytes, `${file} should stay under ${maxBytes} bytes`);
  }
});

test("BRD mascot asset is vector, branded and chatbot-ready", () => {
  const mascot = read("public/assets/brand/brd-mascot-b.svg");
  assert.match(mascot, /<svg[^>]*viewBox="0 0 520 590"/);
  assert.match(mascot, /#964AFB/);
  assert.match(mascot, /#35185A/);
  assert.match(mascot, /Mascote BRD em forma de B/);
  assert.match(mascot, /balao de conversa/);
  assert.match(mascot, /<circle[^>]*fill="#964AFB"/);
});


test("github pages deployment builds the dist artifact", () => {
  const workflow = read(".github/workflows/pages.yml");
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path: dist/);
});
