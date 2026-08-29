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
  assert.doesNotMatch(references, /C:\\Users\\|BRD-identidade-visual/);
  assert.doesNotMatch(references, /Maria foi removida/);
});

test("homepage contains the core BRD institutional content", () => {
  const app = read("src/main.jsx");
  for (const term of [
    "BRD Advocacia",
    "Expertises",
    "Sócios",
    "Inteligência",
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
  assert.match(app, /import \{ buildGmailComposeUrl \} from "\.\/emailLinks\.mjs";/);
  assert.match(app, /function EmailIcon/);
  assert.match(app, /EmailContactLink/);
  assert.match(app, /<EmailIcon \/>/);
  assert.match(app, /<span>\{email\}<\/span>/);
  assert.match(app, /<EmailContactLink email=\{contactEmail\} subject=\{contactEmailSubject\} body=\{contactEmailBody\} \/>/);
  assert.match(app, /href=\{buildGmailComposeUrl\(email, subject, body\)\}/);
  assert.doesNotMatch(app, /href=\{buildGmailComposeUrl\(contactEmail, contactEmailSubject\)\}/);
  assert.match(app, /href=\{`mailto:\$\{contactEmail\}`\}/);
  assert.match(app, /Escrever para \$\{email\} pelo Gmail \(abre em nova aba\)/);
  assert.match(app, /Como chegar no Google Maps \(abre em nova aba\)/);
  assert.match(app, /\$\{social\.label\} do BRD \(abre em nova aba\)/);
  assert.doesNotMatch(app, /buildOutlookComposeUrl|Enviar via Gmail|Enviar via Outlook/);
  assert.match(app, /contactEmail = "contato@brd\.adv\.br"/);
  assert.doesNotMatch(app, /chatAnalysisEmail|@gmail\.com/);
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
  assert.match(app, /aria-labelledby="legal-chat-title"/);
  assert.match(app, /className="skip-link" href="#main-content"/);
  assert.match(app, /<main id="main-content" tabIndex=\{-1\}>/);
  assert.match(app, /<section className="hero" id="inicio"/);
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
    "Revisar e enviar por e-mail",
    "Sem envio automático",
    "Usar meu aplicativo de e-mail",
    "Um novo contato foi iniciado pelo chatbot do site.",
    "[Site BRD] Novo contato",
    "Dados do contato",
    "Observação de segurança",
    "VITE_CONTACT_FORM_ENDPOINT",
    "Usaremos os dados informados",
    "direitos de privacidade",
    "Solicitação enviada",
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

  assert.match(app, /deliverContact\(\{/);
  assert.doesNotMatch(app, /VITE_CONTACT_FORM_ACCESS_KEY|access_key|to_email/);
  assert.match(app, /prepareContactForm/);
  assert.match(app, /resolveSecureUrl/);
  assert.doesNotMatch(app, /window\.location\.assign/);
  assert.match(app, /gmailComposeUrl,/);
  assert.doesNotMatch(app, /window\.location\.href/);
  assert.match(app, /reply_to: cleaned\.email/);
  assert.match(app, /buildChatEmailBody/);
  assert.match(app, /const gmailComposeUrl = buildGmailComposeUrl\(contactEmail, subject, emailBody\)/);
  assert.match(app, /FIELD_LIMITS/);
  assert.match(app, /prepareContactForm\(form, FIELD_LIMITS\)/);
  assert.match(app, /aria-invalid=\{invalidFields\.includes\("name"\) \|\| undefined\}/);
  assert.match(app, /if \(form\.company\)/);
  assert.match(app, /name="company"/);
  assert.doesNotMatch(app, /emailDraft|setEmailDraft/);
  assert.match(app, /brd-mascot-b\.svg/);
  assert.match(app, /Melhor período para retorno/);
  assert.match(app, /placeholder="Ex\.: manhã, tarde ou dia específico"/);
  assert.match(app, /requestAnimationFrame\(\(\) => toggleRef\.current\?\.focus\(\)\)/);
  assert.match(app, /event\.key === "Escape"/);
  assert.match(app, /requestAnimationFrame\(\(\) => menuToggleRef\.current\?\.focus\(\)\)/);
  assert.match(app, /shouldCloseMenuOnEscape\(event\.key, hasOpenContactPanel\)/);
  assert.match(app, /id="contact-privacy-notice"/);
  assert.match(app, /VITE_PRIVACY_POLICY_URL/);
  assert.match(app, /resolveContactEndpoint\(configuredChatFormEndpoint, privacyPolicyUrl\)/);
  assert.match(app, /delivery\.status === "sent"/);
  assert.match(app, /delivery\.status === "draft"/);
  assert.match(app, /delivery\.reason === "popup"/);
  assert.match(app, /role=\{status === "error" \? "alert" : "status"\}/);
  assert.match(app, /O navegador bloqueou o Gmail/);
  assert.doesNotMatch(app, /indeniza[cç][aã]o garantida|caso ganho|resultado garantido/i);
});

test("email composer links open Gmail compose URLs", async () => {
  const { buildGmailComposeUrl } = await importModule("src/emailLinks.mjs");

  assert.equal(
    buildGmailComposeUrl("contato@brd.adv.br", "Contato pelo site BRD", "Linha 1\nLinha 2"),
    "https://mail.google.com/mail/?view=cm&fs=1&to=contato%40brd.adv.br&su=Contato+pelo+site+BRD&body=Linha+1%0ALinha+2",
  );
  assert.equal(
    buildGmailComposeUrl("contato@brd.adv.br"),
    "https://mail.google.com/mail/?view=cm&fs=1&to=contato%40brd.adv.br",
  );
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
  assert.match(styles, /\.legal-chat-panel\s*\{[\s\S]*height: min\(620px, calc\(100dvh - 48px\)\)/);
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
  assert.match(styles, /center center \/ cover/);
  assert.match(styles, /font-size: clamp\(3rem, 12vw, 4\.2rem\)/);
  assert.match(styles, /scroll-padding-top: 96px/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /\.button:focus-visible/);
  assert.match(styles, /\.menu-toggle:focus-visible/);
  assert.match(styles, /\.email-contact-link/);
  assert.match(styles, /\.email-contact-link svg/);
  assert.match(styles, /@media \(max-width: 720px\)[\s\S]*\.email-contact-link\s*\{[\s\S]*width: 100%/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.legal-chat-toggle-icon img\s*\{[\s\S]*animation: none/);
  assert.doesNotMatch(styles, /animation-delay: 0\.01ms !important/);
  assert.match(styles, /\.legal-chat-privacy/);
  assert.match(styles, /font-size: 1rem/);
  assert.doesNotMatch(styles, /overflow-x: auto/);
  assert.doesNotMatch(styles, /letter-spacing:\s*-/);
});

test("skip link stays off-screen until keyboard focus makes it visible", () => {
  const styles = read("src/styles.css");

  assert.match(styles, /\.skip-link\s*\{[^}]*transform:\s*translateY\(-160%\)/s);
  assert.match(styles, /\.skip-link:focus-visible\s*\{[^}]*transform:\s*translateY\(0\)/s);
});

test("mobile contact panel stays inside the viewport and exposes its complete scroll area", () => {
  const styles = read("src/styles.css");
  const mobileBreakpoint = styles.slice(
    styles.indexOf("@media (max-width: 720px)"),
    styles.indexOf("@media (prefers-reduced-motion: reduce)"),
  );

  assert.match(
    styles,
    /@media \(max-width: 720px\)[\s\S]*\.legal-chat-panel\s*\{[^}]*top:\s*max\(8px, env\(safe-area-inset-top\)\)[^}]*bottom:\s*max\(8px, env\(safe-area-inset-bottom\)\)[^}]*height:\s*auto[^}]*max-height:\s*none[^}]*margin-block:\s*0[^}]*transform:\s*none/s,
  );
  assert.match(styles, /\.legal-chat-panel\s*\{[^}]*overflow:\s*auto/s);
  assert.doesNotMatch(mobileBreakpoint, /max-height:\s*min\(620px, calc\(100svh - 64px\)\)/);
});

test("desktop contact panel stays in the viewport without relying on animated transforms", () => {
  const styles = read("src/styles.css");
  const panelRule = styles.match(/\.legal-chat-panel\s*\{(?<declarations>[^}]*)\}/s)?.groups?.declarations ?? "";

  assert.match(panelRule, /top:\s*24px/);
  assert.match(panelRule, /bottom:\s*24px/);
  assert.match(panelRule, /height:\s*min\(620px, calc\(100vh - 48px\)\)/);
  assert.match(panelRule, /height:\s*min\(620px, calc\(100dvh - 48px\)\)/);
  assert.match(panelRule, /margin-block:\s*auto/);
  assert.match(panelRule, /overflow:\s*auto/);
  assert.doesNotMatch(panelRule, /top:\s*50%|translateY\(-50%\)/);
});

test("external window helper reports popup success and failure", async () => {
  const { openExternalWindow } = await importModule("src/externalLinks.mjs");
  const calls = [];
  const navigations = [];
  const popup = {
    opener: {},
    location: { replace: (url) => navigations.push(url) },
  };

  assert.equal(
    openExternalWindow("https://example.com", (...args) => {
      calls.push(args);
      return popup;
    }),
    true,
  );
  assert.deepEqual(calls, [["", "_blank"]]);
  assert.equal(popup.opener, null);
  assert.deepEqual(navigations, ["https://example.com"]);
  assert.equal(openExternalWindow("https://example.com", () => null), false);
  assert.equal(openExternalWindow("https://example.com", null), false);

  let closeCalls = 0;
  const brokenPopup = {
    opener: {},
    location: {
      replace: () => {
        throw new Error("navigation blocked");
      },
    },
    close: () => {
      closeCalls += 1;
    },
  };

  assert.equal(openExternalWindow("https://example.com", () => brokenPopup), false);
  assert.equal(brokenPopup.opener, null);
  assert.equal(closeCalls, 1);
});

test("contact delivery gates endpoints and reports every transport outcome", async () => {
  const { deliverContact, resolveContactEndpoint, resolveSecureUrl } = await importModule("src/contactDelivery.mjs");

  assert.equal(resolveContactEndpoint("https://api.example/contact", "https://example/privacy"), "https://api.example/contact");
  assert.equal(resolveContactEndpoint("http://api.example/contact", "https://example/privacy"), "");
  assert.equal(resolveContactEndpoint("https://api.example/contact", "http://example/privacy"), "");
  assert.equal(resolveContactEndpoint("not-a-url", "https://example/privacy"), "");
  assert.equal(resolveContactEndpoint("https://api.example/contact", ""), "");
  assert.equal(resolveContactEndpoint("", "https://example/privacy"), "");
  assert.equal(resolveSecureUrl(" https://example.com/privacy "), "https://example.com/privacy");
  assert.equal(resolveSecureUrl("http://example.com/privacy"), "");
  assert.equal(resolveSecureUrl("https://user:secret@example.com/privacy"), "");

  const requests = [];
  const base = {
    endpoint: "https://api.example/contact",
    payload: { name: "Pessoa", message: "Olá" },
    gmailComposeUrl: "https://mail.google.com/draft",
  };

  assert.deepEqual(
    await deliverContact(base, {
      fetchFn: async (...args) => {
        requests.push(args);
        return { ok: true };
      },
    }),
    { status: "sent" },
  );
  assert.equal(requests[0][0], base.endpoint);
  assert.equal(requests[0][1].method, "POST");
  assert.deepEqual(JSON.parse(requests[0][1].body), base.payload);

  assert.deepEqual(
    await deliverContact(base, { fetchFn: async () => ({ ok: false }) }),
    { status: "error", reason: "network" },
  );
  assert.deepEqual(
    await deliverContact(base, { fetchFn: async () => { throw new Error("offline"); } }),
    { status: "error", reason: "network" },
  );

  const gmailOnly = { ...base, endpoint: "" };
  assert.deepEqual(
    await deliverContact(gmailOnly, {
      openWindow: () => ({ opener: {}, location: { replace: () => {} } }),
    }),
    { status: "draft" },
  );
  assert.deepEqual(
    await deliverContact(gmailOnly, { openWindow: () => null }),
    { status: "error", reason: "popup" },
  );
});

test("contact delivery uses exactly one transport per attempt", async () => {
  const { deliverContact } = await importModule("src/contactDelivery.mjs");
  const request = {
    payload: { name: "Pessoa", message: "Olá" },
    gmailComposeUrl: "https://mail.google.com/draft",
  };
  let fetchCalls = 0;
  let popupCalls = 0;

  assert.deepEqual(
    await deliverContact(
      { ...request, endpoint: "https://api.example/contact" },
      {
        fetchFn: async () => {
          fetchCalls += 1;
          return { ok: true };
        },
        openWindow: () => {
          popupCalls += 1;
          return null;
        },
      },
    ),
    { status: "sent" },
  );
  assert.equal(fetchCalls, 1);
  assert.equal(popupCalls, 0);

  fetchCalls = 0;
  popupCalls = 0;
  assert.deepEqual(
    await deliverContact(
      { ...request, endpoint: "" },
      {
        fetchFn: async () => {
          fetchCalls += 1;
          return { ok: true };
        },
        openWindow: () => {
          popupCalls += 1;
          return { opener: {}, location: { replace: () => {} } };
        },
      },
    ),
    { status: "draft" },
  );
  assert.equal(fetchCalls, 0);
  assert.equal(popupCalls, 1);
});

test("Motion adds restrained, accessible interface animation", () => {
  const app = read("src/main.jsx");
  const styles = read("src/styles.css");
  const packageJson = JSON.parse(read("package.json"));

  assert.ok(packageJson.dependencies.motion);
  assert.match(app, /from "motion\/react"/);
  assert.match(app, /<LazyMotion features=\{domAnimation\}>/);
  assert.match(app, /<MotionConfig reducedMotion="user">/);
  assert.match(app, /useReducedMotion\(\)/);
  assert.match(app, /useAnimate\(\)/);
  assert.match(app, /useInView\(scope, \{ once: true, amount: 0\.45 \}\)/);
  assert.match(app, /useScroll\(\)/);
  assert.match(app, /useSpring\(scrollYProgress/);
  assert.match(app, /className="scroll-progress"/);
  assert.match(app, /whileInView="visible"/);
  assert.match(app, /viewport=\{sectionViewport\}/);
  assert.match(app, /<AnimatePresence>/);
  assert.match(app, /exit=\{\{ opacity: 0/);
  assert.match(app, /const sequence = \[/);
  assert.match(app, /className="metric-track"/);
  assert.match(app, /className="metric-fill"/);
  assert.match(app, /aria-label=\{`\$\{item\.value\} de 100`\}/);
  assert.match(styles, /\.scroll-progress\s*\{/);
  assert.match(styles, /transform-origin: 0 50%/);
  assert.match(styles, /\.metric-fill\s*\{[\s\S]*transform-origin: left center/);
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
  assert.match(workflow, /branches:\s*\n\s*- main/);
  assert.doesNotMatch(workflow, /^\s*- develop\s*$/m);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /path: dist/);
});
