import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { build, preview } from 'vite';
import { chromium } from 'playwright';
import { browserBuildConfig, contactFixture } from './qa-browser-config.mjs';

await build(browserBuildConfig);
const server = await preview({ ...browserBuildConfig, preview: { host: '127.0.0.1', port: 0, open: false } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
const report = { synthetic: true, nativeZoomValidated: false, screenReaderValidated: false, realContactDelivered: false, cases: [] };
const caseFilter = process.argv.includes('--filter') ? process.env.QA_CASE_FILTER : undefined;

async function fixture(viewport, run, outcome = 'success', reducedMotion = 'reduce') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const calls = [];
  let release;
  try {
    await context.addInitScript(() => { window.popupCalls = 0; window.open = () => { window.popupCalls++; return null; }; });
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (request.url() === contactFixture && request.method() === 'POST') {
        calls.push(request.postDataJSON());
        if (outcome === 'pending') await new Promise(resolve => { release = resolve; });
        await route.fulfill({ status: outcome === 'error' ? 503 : 200, contentType: 'application/json', body: '{}' }).catch(() => {});
      } else if (url.origin === base && ['GET', 'HEAD'].includes(request.method())) await route.continue();
      else await route.abort();
    });
    const page = await context.newPage();
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('heading', { level: 1 }).waitFor();
    await run(page, calls);
    assert.equal(await page.evaluate(() => window.popupCalls), 0);
  } finally { release?.(); await context.close(); }
}

async function check(name, run) {
  if (caseFilter && !name.includes(caseFilter)) return;
  try { await run(); report.cases.push({ name, passed: true }); console.log('PASS', name); }
  catch (error) { report.cases.push({ name, passed: false, reason: error.message }); console.error('FAIL', name, error.message); }
}

async function openDialog(page) {
  await page.getByRole('button', { name: 'Abrir atendimento inicial', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.legal-chat-panel')).opacity) >= 0.99);
}

async function fill(page) {
  await page.locator('[name=name]').fill('Pessoa fictícia QA');
  await page.locator('[name=email]').fill('fixture@example.test');
  await page.locator('[name=topic]').selectOption('Contratos');
  await page.locator('[name=message]').fill('Solicitação fictícia de teste.');
}

async function focusProof(page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    const panel = document.querySelector('.legal-chat-panel');
    const rect = element.getBoundingClientRect(), bounds = panel.getBoundingClientRect();
    const header = panel.querySelector('.legal-chat-header').getBoundingClientRect();
    const visibleTop = element.closest('.legal-chat-header') ? bounds.top : header.bottom;
    const visibleHeight = Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, visibleTop);
    return { inside: panel.contains(element), name: element.getAttribute('name') || element.getAttribute('aria-label'),
      geometry: { top: rect.top, bottom: rect.bottom, headerBottom: header.bottom, panelBottom: bounds.bottom },
      visible: rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1 && visibleHeight >= Math.min(32, rect.height) };
  });
}

async function reflowProof(page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return { width, scrollWidth: document.documentElement.scrollWidth,
      offenders: [...document.querySelectorAll('body *')].filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.width && rect.right > width + 1 && !element.closest('.legal-chat-honeypot');
      }).slice(0, 8).map(element => ({ tag: element.tagName, class: element.className, right: element.getBoundingClientRect().right })) };
  });
}

try {
  browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_CHANNEL ? { channel: process.env.QA_BROWSER_CHANNEL } : {}) });
  report.browser = browser.version();
  await check('desktop skip link and initial dialog focus', () => fixture({ width: 1280, height: 900 }, async page => {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.className), 'skip-link');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
    await openDialog(page);
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Fechar atendimento inicial');
    await page.locator('.brand').evaluate(element => element.focus());
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('.legal-chat-panel')), true);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement.className.includes('legal-chat-toggle')), true);
  }));
  await check('mobile menu and active-layer Escape', () => fixture({ width: 390, height: 844 }, async page => {
    const menu = page.getByRole('button', { name: 'Abrir menu', exact: true });
    await menu.focus(); await page.keyboard.press('Enter');
    await page.locator('#main-navigation').waitFor({ state: 'visible' });
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Sobre');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement.tagName === 'H2');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H2');
    await page.locator('.menu-toggle').click();
    await openDialog(page);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  }));
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 390 }, { width: 640, height: 450 }]) {
    await check(`reflow and keyboard at ${viewport.width}x${viewport.height}`, () => fixture(viewport, async page => {
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true, 'document horizontal overflow');
      await openDialog(page);
      for (let step = 0; step < 13; step++) {
        await page.keyboard.press('Tab');
        const proof = await focusProof(page);
        assert.equal(proof.inside, true, 'focus escaped dialog');
        assert.equal(proof.visible, true, `focused control obscured: ${proof.name} ${JSON.stringify(proof.geometry)}`);
      }
      await page.getByRole('button', { name: 'Fechar atendimento inicial', exact: true }).focus();
      await page.keyboard.press('Shift+Tab');
      assert.equal((await focusProof(page)).inside, true);
      assert.equal(await page.evaluate(() => document.activeElement.type), 'submit');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Fechar atendimento inicial');
    }));
  }
  await check('root text scaling approximation and reduced-motion chart', () => fixture({ width: 1280, height: 900 }, async page => {
    await mkdir('.tmp', { recursive: true });
    await page.locator('footer').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'end' }));
    await page.waitForFunction(() => ['.footer-brand', '.footer-grid'].every(selector => Number(getComputedStyle(document.querySelector(selector)).opacity) >= 0.99));
    await page.screenshot({ path: '.tmp/qa-desktop-20261012.png' });
    await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
    const overflow = await reflowProof(page);
    assert.equal(overflow.scrollWidth <= overflow.width + 1, true, JSON.stringify(overflow));
    await page.locator('footer').evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'end' }));
    await page.screenshot({ path: '.tmp/qa-textscale-20261012.png' });
    await page.locator('.chart-panel').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    assert.equal(await page.locator('.chart-copy').evaluate(element => Number(getComputedStyle(element).opacity)), 1);
    assert.equal(await page.locator('.metric-fill').first().evaluate(element => getComputedStyle(element).transform), 'none');
  }));
  await check('invalid contact has no POST', () => fixture({ width: 390, height: 844 }, async (page, calls) => {
    await openDialog(page);
    await page.screenshot({ path: '.tmp/qa-mobile-20261012.png' });
    await page.getByRole('button', { name: 'Enviar solicitação', exact: true }).click();
    assert.equal(await page.evaluate(() => document.activeElement.name), 'name');
    assert.equal(calls.length, 0);
  }));
  await check('normal-motion chart remains readable after direct scroll', () => fixture({ width: 1280, height: 900 }, async page => {
    await page.locator('.chart-panel').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('.chart-copy')).opacity) === 1, undefined, { timeout: 5000 });
  }, 'success', 'no-preference'));
  for (const outcome of ['success', 'error', 'pending']) {
    await check(`contact fixture ${outcome}`, () => fixture({ width: 390, height: 844 }, async (page, calls) => {
      await openDialog(page); await fill(page);
      await page.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
      if (outcome === 'pending') {
        await page.getByRole('button', { name: 'Enviando...', exact: true }).waitFor();
        await page.keyboard.press('Escape');
        await page.getByRole('dialog').waitFor({ state: 'detached' });
        await openDialog(page);
        await page.locator('form').evaluate(form => form.requestSubmit());
      }
      const feedback = page.locator('#contact-form-feedback');
      await feedback.waitFor({ timeout: 16000 });
      assert.equal(calls.length, 1);
      if (outcome === 'success') {
        assert.match(await feedback.textContent(), /Solicitação enviada/);
        assert.equal(await page.locator('[name=name]').inputValue(), '');
      } else {
        assert.match(await feedback.textContent(), /pode ter sido recebida/);
        assert.equal(await page.locator('[name=name]').inputValue(), 'Pessoa fictícia QA');
        assert.equal(await page.locator('[name=message]').inputValue(), 'Solicitação fictícia de teste.');
      }
    }, outcome));
  }
  await mkdir('.tmp', { recursive: true });
  const reportPath = caseFilter ? '.tmp/qa-browser-filtered-20261012.json' : '.tmp/qa-browser-20261012.json';
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  assert.ok(report.cases.length > 0, 'No browser QA cases selected');
  assert.equal(report.cases.every(result => result.passed), true, 'Browser QA found failing cases');
} finally { await browser?.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
