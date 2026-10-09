const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const root = path.join(__dirname, "..");

function importModule(file) {
  return import(pathToFileURL(path.join(root, file)).href);
}

test("Escape gives the open contact panel priority over the mobile menu", async () => {
  const { getDialogFocusDestination, shouldCloseMenuOnEscape } = await importModule("src/keyboardNavigation.mjs");

  assert.equal(shouldCloseMenuOnEscape("Escape", false), true);
  assert.equal(shouldCloseMenuOnEscape("Escape", true), false);
  assert.equal(shouldCloseMenuOnEscape("Enter", false), false);

  assert.equal(getDialogFocusDestination("Tab", true, 0, 4), 3);
  assert.equal(getDialogFocusDestination("Tab", false, 3, 4), 0);
  assert.equal(getDialogFocusDestination("Tab", false, 1, 4), null);
  assert.equal(getDialogFocusDestination("Escape", false, 3, 4), null);
  assert.equal(getDialogFocusDestination("Tab", false, -1, 0), null);
});
