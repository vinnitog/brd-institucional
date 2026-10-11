const { before, after, beforeEach, afterEach, test } = require("node:test");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

const endpoint = "https://contact.example.test/request";
const globals = new Map();
let dom, vite, React, App, root, createRoot, request, calls = [], timer, now = 0, popupCalls = 0;

function install(name, value) {
  globals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
async function click(selector) {
  await React.act(async () => { document.querySelector(selector).click(); });
}
async function fill() {
  await React.act(async () => {
    for (const [name, value] of Object.entries({ name: "Pessoa QA", email: "contato@example.test", message: "Solicitação sintética QA", topic: "Recuperação de crédito" })) {
      const element = document.querySelector(`[name="${name}"]`);
      const prototype = element.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype
        : element.tagName === "SELECT" ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, "value").set.call(element, value);
      element.dispatchEvent(new dom.window.Event(element.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    }
  });
}
async function submitTwice() {
  await React.act(async () => {
    const form = document.querySelector(".legal-chat-form");
    for (let attempt = 0; attempt < 2; attempt++) form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
  });
}

before(async () => {
  dom = new JSDOM('<div id="root"></div>', { url: "https://site.example.test/" });
  for (const name of ["window", "document", "navigator", "HTMLElement", "SVGElement", "Element", "Node", "Event", "MouseEvent"]) {
    install(name, name === "window" ? dom.window : dom.window[name]);
  }
  install("IS_REACT_ACT_ENVIRONMENT", true);
  install("requestAnimationFrame", () => 0);
  install("cancelAnimationFrame", () => {});
  install("getComputedStyle", dom.window.getComputedStyle.bind(dom.window));
  class Observer { observe() {} unobserve() {} disconnect() {} }
  install("IntersectionObserver", Observer);
  install("ResizeObserver", Observer);
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  dom.window.requestAnimationFrame = globalThis.requestAnimationFrame;
  dom.window.cancelAnimationFrame = globalThis.cancelAnimationFrame;
  dom.window.scrollTo = () => {};
  dom.window.open = () => { popupCalls++; throw new Error("external window forbidden in QA"); };
  install("fetch", (url, options) => {
    assert.equal(url, endpoint, "only the fictitious transport is permitted");
    calls.push({ url, options });
    return request.promise;
  });
  const { createServer } = await import("vite");
  React = await import("react");
  ({ createRoot } = await import("react-dom/client"));
  vite = await createServer({ configFile: false, envFile: false, server: { middlewareMode: true }, appType: "custom",
    plugins: [{ name: "qa-independent-app-mount", enforce: "pre", transform(source, id) {
      if (!id.endsWith("/src/main.jsx")) return;
      const mount = /createRoot\(document\.getElementById\("root"\)\)\.render\([\s\S]*?\);\s*$/;
      assert.match(source, mount, "entrypoint mount must remain recognizable");
      return source.replace(mount, "export { App };");
    } }],
    define: { "import.meta.env.VITE_CONTACT_FORM_ENDPOINT": JSON.stringify(endpoint),
      "import.meta.env.VITE_PRIVACY_POLICY_URL": JSON.stringify("https://privacy.example.test/policy") } });
  ({ App } = await vite.ssrLoadModule("/src/main.jsx"));
});

beforeEach(async () => {
  calls = [];
  popupCalls = 0;
  now = 0;
  timer = undefined;
  request = deferred();
  root = createRoot(document.getElementById("root"));
  await React.act(async () => { root.render(React.createElement(React.StrictMode, null, React.createElement(App))); });
  await click(".legal-chat-toggle");
});

afterEach(async () => {
  await React.act(async () => { root?.unmount(); });
  root = undefined;
});

after(async () => {
  await vite?.close();
  dom?.window.close();
  for (const [name, descriptor] of globals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
});

test("painel modal isola o conteúdo assistivo e restaura atributos ao fechar e desmontar", async () => {
  const background = Array.from(document.getElementById("root").children)
    .filter(element => !element.classList.contains("legal-chat"));
  assert.ok(background.length >= 4);
  for (const element of background) {
    assert.equal(element.hasAttribute("inert"), true, "background must not accept focus while modal is open");
    assert.equal(element.getAttribute("aria-hidden"), "true", "background must be excluded from assistive navigation");
  }
  assert.equal(document.activeElement.getAttribute("aria-label"), "Fechar atendimento inicial");
  await click('[aria-label="Fechar atendimento inicial"]');
  for (const element of background) {
    assert.equal(element.hasAttribute("inert"), false);
    assert.equal(element.hasAttribute("aria-hidden"), false);
  }
  const main = document.getElementById("main-content");
  main.setAttribute("aria-hidden", "false");
  await click(".legal-chat-toggle");
  assert.equal(main.getAttribute("aria-hidden"), "true");
  await React.act(async () => { root.unmount(); });
  root = undefined;
  assert.equal(main.hasAttribute("inert"), false);
  assert.equal(main.getAttribute("aria-hidden"), "false", "cleanup preserves attributes owned by other code");
});

test("formulário real bloqueia submissão dupla ao reabrir, conserva campos no deadline e permite tentativa manual", async (t) => {
  const nativeTimeout = globalThis.setTimeout;
  const nativeClear = globalThis.clearTimeout;
  t.mock.method(Date, "now", () => now);
  t.mock.method(globalThis, "setTimeout", (callback, delay, ...args) => {
    if (delay !== 12000) return nativeTimeout(callback, delay, ...args);
    timer = { callback, cleared: false };
    return timer;
  });
  t.mock.method(globalThis, "clearTimeout", (id) => {
    if (id === timer) timer.cleared = true;
    else nativeClear(id);
  });
  request = deferred();
  await fill();
  await submitTwice();
  assert.equal(calls.length, 1);
  assert.equal(document.querySelector('[type="submit"]').disabled, true);
  await click('[aria-label="Fechar atendimento inicial"]');
  assert.equal(calls[0].options.signal.aborted, false, "fechar painel não cancela a tentativa");
  await click(".legal-chat-toggle");
  await submitTwice();
  assert.equal(calls.length, 1, "reabrir durante envio mantém a guarda");
  assert.equal(document.querySelector('[type="submit"]').disabled, true);
  await click('[aria-label="Fechar atendimento inicial"]');
  now = 12000;
  await React.act(async () => { timer.callback(); });
  assert.equal(timer.cleared, true);
  await click(".legal-chat-toggle");
  assert.equal(document.querySelector('[name="name"]').value, "Pessoa QA");
  assert.equal(document.querySelector('[name="message"]').value, "Solicitação sintética QA");
  assert.equal(document.querySelector('[type="submit"]').disabled, false);
  const feedback = document.getElementById("contact-form-feedback");
  assert.equal(feedback.getAttribute("role"), "alert");
  assert.match(feedback.textContent, /pode ter sido recebida/);
  assert.match(feedback.textContent, /confirme o recebimento/);
  const timeoutFeedback = feedback.textContent;
  assert.equal(popupCalls, 0);
  await React.act(async () => { request.resolve({ ok: true }); });
  assert.equal(document.getElementById("contact-form-feedback").textContent, timeoutFeedback);
  assert.equal(document.querySelector('[name="message"]').value, "Solicitação sintética QA");
  request = deferred();
  await submitTwice();
  assert.equal(calls.length, 2, "tentativa manual após término usa a guarda liberada");
  await React.act(async () => { request.resolve({ ok: true }); });
  assert.match(document.getElementById("contact-form-feedback").textContent, /Solicitação enviada/);
  assert.equal(document.querySelector('[name="message"]').value, "");
  assert.equal(timer.cleared, true);
});

test("sucesso antes do limite limpa campos e libera guarda em formulário independente", async () => {
  request = deferred();
  await fill();
  await submitTwice();
  assert.equal(calls.length, 1);
  assert.equal(document.querySelector('[type="submit"]').disabled, true);
  await React.act(async () => { request.resolve({ ok: true }); });
  assert.match(document.getElementById("contact-form-feedback").textContent, /Solicitação enviada/);
  assert.equal(document.querySelector('[name="name"]').value, "");
  assert.equal(document.querySelector('[name="message"]').value, "");
  assert.equal(document.querySelector('[type="submit"]').disabled, false);
  assert.equal(popupCalls, 0);
});

test("erro de rede conserva dados e libera guarda sem instrução de retry cego", async () => {
  await fill();
  request = deferred();
  await submitTwice();
  assert.equal(calls.length, 1);
  await React.act(async () => { request.reject(new Error("synthetic network error")); });
  const feedback = document.getElementById("contact-form-feedback");
  assert.match(feedback.textContent, /Não foi possível confirmar/);
  assert.doesNotMatch(feedback.textContent, /Não foi possível enviar|tente novamente em instantes/);
  assert.equal(document.querySelector('[name="message"]').value, "Solicitação sintética QA");
  assert.equal(document.querySelector('[type="submit"]').disabled, false);
  assert.equal(popupCalls, 0);
});
