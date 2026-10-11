// Checks the built artifact and real loopback HTTP, never a public origin or POST.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { preview } from "vite";

const html = await readFile("dist/index.html", "utf8");
const preloads = [...html.matchAll(/<link[^>]+as="font"[^>]+href="([^"]+)"[^>]*>/g)].map(match => match[1]);
assert.equal(preloads.length, 2);
assert.ok(preloads.every(url => url.endsWith(".woff2") && url.startsWith("/")));
const prefix = preloads[0].slice(0, preloads[0].indexOf("/fonts/") + 1);
assert.ok(prefix === "/" || prefix === "/brd-institucional/", "only the two local deployment bases are permitted");
const server = await preview({ configFile: false, envFile: false, base: prefix, preview: { host: "127.0.0.1", port: 0 } });
const base = `http://127.0.0.1:${server.httpServer.address().port}`;
try {
  const cssUrl = html.match(/href="([^"]+\.css)"/)?.[1];
  const cssAddress = new URL(cssUrl, base);
  assert.equal(cssAddress.origin, base, "external requests are forbidden");
  const cssResponse = await fetch(cssAddress, { signal: AbortSignal.timeout(5000) });
  assert.equal(cssResponse.status, 200);
  const css = await cssResponse.text();
  for (const name of ["DMSans-VariableFont_opsz,wght", "Gupter-Regular", "Gupter-Bold"]) {
    for (const extension of ["woff2", "ttf"]) {
      const url = `${prefix}fonts/${name}.${extension}`;
      assert.ok(css.includes(url), "built CSS must reference the proper deployment base and original fallback");
      const response = await fetch(new URL(url, base), { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, 200);
      assert.match(response.headers.get("content-type"), extension === "woff2" ? /font\/woff2/ : /font\/ttf/);
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(`public/fonts/${name}.${extension}`));
    }
  }
  console.log(JSON.stringify({ basePath: prefix, preloads: preloads.length, fontResponses: 6, matchingBytes: true }));
} finally {
  await server.close();
}
