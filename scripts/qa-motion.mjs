import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { build, preview } from 'vite';
import { chromium } from 'playwright';
import { browserBuildConfig } from './qa-browser-config.mjs';

await build(browserBuildConfig);
const server = await preview({ ...browserBuildConfig, preview: { host: '127.0.0.1', port: 0, open: false } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
let browser;
const report = { synthetic: true, cpuThrottle: 4, viewport: { width: 1280, height: 900 }, productionMeasured: false, samples: [] };

async function sample(reducedMotion) {
  const context = await browser.newContext({ viewport: report.viewport, reducedMotion });
  try {
    await context.route('**/*', route => {
      const request = route.request(), url = new URL(request.url());
      return url.origin === base && ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    return await page.evaluate(async reducedMotion => {
      const tasks = [], frames = [];
      const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => entry.duration)));
      observer.observe({ type: 'longtask' });
      let active = true, previous;
      function frame(time) {
        if (previous !== undefined) frames.push(time - previous);
        previous = time;
        if (active) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      const start = performance.now();
      let chartVisibleRatio;
      for (const id of ['sobre', 'socios', 'expertises', 'inteligencia', 'contato']) {
        document.getElementById(id).scrollIntoView({ behavior: 'instant', block: 'start' });
        if (id === 'inteligencia') {
          const chart = document.querySelector('.chart-panel');
          chart.scrollIntoView({ behavior: 'instant', block: 'center' });
          const bounds = chart.getBoundingClientRect();
          chartVisibleRatio = Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top)) / bounds.height;
        }
        await new Promise(resolve => setTimeout(resolve, 650));
      }
      document.querySelector('.legal-chat-toggle').click();
      await new Promise(resolve => setTimeout(resolve, 650));
      document.querySelector('.legal-chat-header button').click();
      await new Promise(resolve => setTimeout(resolve, 650));
      active = false;
      tasks.push(...observer.takeRecords().map(entry => entry.duration));
      observer.disconnect();
      const sorted = [...frames].sort((a, b) => a - b);
      return { reducedMotion, durationMs: performance.now() - start, longTasks: tasks.length,
        totalLongTaskMs: tasks.reduce((sum, value) => sum + value, 0),
        longestTaskMs: tasks.length ? Math.max(...tasks) : 0,
        rafIntervals: frames.length, rafGapsOver50ms: frames.filter(value => value > 50).length,
        p95RafIntervalMs: sorted[Math.floor(sorted.length * 0.95)] ?? null,
        dialogClosed: !document.getElementById('legal-chat-panel'),
        chartVisibleRatio, metricCopyOpacity: Number(getComputedStyle(document.querySelector('.chart-copy')).opacity) };
    }, reducedMotion);
  } finally { await context.close(); }
}

try {
  browser = await chromium.launch({ headless: true, ...(process.env.QA_BROWSER_CHANNEL ? { channel: process.env.QA_BROWSER_CHANNEL } : {}) });
  report.browser = browser.version();
  await sample('no-preference'); // Warmup is excluded from reported samples.
  for (const reducedMotion of ['no-preference', 'reduce']) {
    for (let iteration = 0; iteration < 3; iteration++) {
      const result = await sample(reducedMotion);
      assert.equal(result.dialogClosed, true);
      assert.ok(result.chartVisibleRatio >= 0.45);
      assert.equal(result.metricCopyOpacity, 1);
      report.samples.push({ iteration, ...result });
    }
  }
  await mkdir('.tmp', { recursive: true });
  await writeFile('.tmp/qa-motion-20261012.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
}
