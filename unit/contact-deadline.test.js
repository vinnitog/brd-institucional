const test = require("node:test");
const assert = require("node:assert/strict");

const base = { endpoint: "https://contact.example.test/request", payload: { name: "Pessoa QA" }, gmailComposeUrl: "https://mail.google.com/draft" };
const timeout = { status: "error", reason: "timeout" };
const load = () => import("../src/contactDelivery.mjs");

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test("deadline termina em 12s com abort, sem fallback ou retry, mesmo se fetch ignorar abort", async (t) => {
  const { deliverContact, CONTACT_TIMEOUT_MS } = await load();
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  let calls = 0, popups = 0, signal, settled = false;
  const request = deferred();
  const delivery = deliverContact(base, { fetchFn: (_url, options) => { calls++; signal = options.signal; return request.promise; },
    openWindow: () => { popups++; return null; } }).then((result) => { settled = true; return result; });
  assert.equal(CONTACT_TIMEOUT_MS, 12000);
  t.mock.timers.tick(CONTACT_TIMEOUT_MS - 1);
  await Promise.resolve();
  assert.equal(settled, false);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  assert.deepEqual(await delivery, timeout);
  assert.equal(signal.aborted, true);
  assert.equal(calls, 1);
  assert.equal(popups, 0);
  request.resolve({ ok: true });
  await Promise.resolve();
  assert.deepEqual(await delivery, timeout);
  assert.equal(calls, 1);
});

test("rejeição por abort continua classificada como timeout e rejeição tardia é tratada", async (t) => {
  const { deliverContact } = await load();
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const request = deferred();
  const delivery = deliverContact(base, { fetchFn: (_url, { signal }) => {
    signal.addEventListener("abort", () => request.reject(new DOMException("Aborted", "AbortError")), { once: true });
    return request.promise;
  } });
  t.mock.timers.tick(12000);
  assert.deepEqual(await delivery, timeout);
  const late = deferred();
  const second = deliverContact(base, { fetchFn: () => late.promise });
  t.mock.timers.tick(12000);
  assert.deepEqual(await second, timeout);
  late.reject(new Error("late synthetic failure"));
  await Promise.resolve();
  assert.deepEqual(await second, timeout);
});

test("resposta observada após deadline não confirma sucesso mesmo antes de rodar callback do timer", async (t) => {
  const { deliverContact } = await load();
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const request = deferred();
  let signal;
  const delivery = deliverContact(base, { fetchFn: (_url, options) => { signal = options.signal; return request.promise; } });
  t.mock.timers.setTime(12001);
  request.resolve({ ok: true });
  assert.deepEqual(await delivery, timeout);
  assert.equal(signal.aborted, true);
});

test("sucesso e falhas antes do deadline limpam timer sem abortar ou abrir Gmail", async (t) => {
  const { deliverContact } = await load();
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  for (const [fetchFn, expected] of [
    [async () => ({ ok: true }), { status: "sent" }],
    [async () => ({ ok: false }), { status: "error", reason: "network" }],
    [async () => { throw new Error("offline QA"); }, { status: "error", reason: "network" }],
  ]) {
    let signal, popups = 0;
    const result = await deliverContact(base, { fetchFn: (url, options) => { signal = options.signal; return fetchFn(url, options); },
      openWindow: () => { popups++; return null; } });
    assert.deepEqual(result, expected);
    t.mock.timers.tick(12000);
    assert.equal(signal.aborted, false, "timer deve estar limpo após terminar");
    assert.equal(popups, 0);
  }
});

test("sem endpoint continua apenas rascunho manual, sem fetch ou timer de rede", async (t) => {
  const { deliverContact } = await load();
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  let fetchCalls = 0;
  assert.deepEqual(await deliverContact({ ...base, endpoint: "" }, { fetchFn: () => { fetchCalls++; },
    openWindow: () => ({ opener: null, location: { replace() {} } }) }), { status: "draft" });
  t.mock.timers.tick(12000);
  assert.equal(fetchCalls, 0);
});
