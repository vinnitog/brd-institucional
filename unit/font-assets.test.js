const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const root = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name));

test("local font derivatives retain reviewed originals and complete WOFF2 containers", () => {
  for (const [name, originalHash, packagedHash, originalSize] of [
    ["DMSans-VariableFont_opsz,wght", "eee6afef9be6c51ba4a4cc7cc2ab4f78dbdac6a3b39419633b8d3481e0736182", "73b9edbaeeb04b4372061efeb6a48a8add727c9813d825bc1b2c7dae808e96a4", 238984],
    ["Gupter-Regular", "9cf5d82e12ab37468b274c0579c8519e8146c0cc73e22fa7a7655530b7b97796", "7b338e35835cf935fe573cbfbf5a4d287d5af63de93470b9aa0fbdb2aa5549da", 51504],
    ["Gupter-Bold", "25e04aa249034055188ee25243151a46b1e049d52fc87d3a6000a1cfc86c2994", "71064411116cfcbf944d911d1579d41264100961d11264f03195c2031501de7e", 52352],
  ]) {
    const original = read(`public/fonts/${name}.ttf`), packaged = read(`public/fonts/${name}.woff2`);
    assert.equal(createHash("sha256").update(original).digest("hex"), originalHash);
    assert.equal(createHash("sha256").update(packaged).digest("hex"), packagedHash);
    assert.equal(packaged.subarray(0, 4).toString(), "wOF2");
    assert.equal(packaged.readUInt32BE(8), packaged.length);
    assert.equal(packaged.readUInt32BE(16), originalSize, "complete SFNT data remains; no subsetting");
    assert.ok(packaged.length < original.length);
  }
});

test("font preload matches preferred local format and CSS retains all original fallbacks", () => {
  const styles = read("src/styles.css").toString(), html = read("index.html").toString();
  assert.doesNotMatch(html, /as="font"[^>]+\.ttf/);
  assert.equal([...html.matchAll(/as="font" type="font\/woff2"[^>]+crossorigin/g)].length, 2);
  for (const name of ["DMSans-VariableFont_opsz,wght", "Gupter-Regular", "Gupter-Bold"]) {
    assert.ok(styles.includes(`src: url("/fonts/${name}.woff2") format("woff2"), url("/fonts/${name}.ttf") format("truetype");`));
  }
  assert.match(styles, /font-weight: 100 1000/);
  assert.equal(styles.match(/font-display: swap/g).length, 3);
});
