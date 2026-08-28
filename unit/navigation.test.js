const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const root = path.join(__dirname, "..");

function importModule(file) {
  return import(pathToFileURL(path.join(root, file)).href);
}

test("Escape gives the open contact panel priority over the mobile menu", async () => {
  const { shouldCloseMenuOnEscape } = await importModule("src/keyboardNavigation.mjs");

  assert.equal(shouldCloseMenuOnEscape("Escape", false), true);
  assert.equal(shouldCloseMenuOnEscape("Escape", true), false);
  assert.equal(shouldCloseMenuOnEscape("Enter", false), false);
});
