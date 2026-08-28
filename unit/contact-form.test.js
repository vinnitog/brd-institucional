const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const root = path.join(__dirname, "..");

function importModule(file) {
  return import(pathToFileURL(path.join(root, file)).href);
}

test("contact form trims values and identifies required fields containing only spaces", async () => {
  const { prepareContactForm } = await importModule("src/contactForm.mjs");
  const limits = { name: 12, email: 40, phone: 12, topic: 20, message: 30, schedule: 20 };

  const result = prepareContactForm({
    name: "   ",
    email: " pessoa@example.com ",
    phone: " 14999999999 ",
    topic: " Contratos ",
    message: "\t\n",
    schedule: " manhã ",
  }, limits);

  assert.deepEqual(result.invalidFields, ["name", "message"]);
  assert.deepEqual(result.cleaned, {
    name: "",
    email: "pessoa@example.com",
    phone: "14999999999",
    topic: "Contratos",
    message: "",
    schedule: "manhã",
  });
});

test("contact form applies public field limits after trimming", async () => {
  const { prepareContactForm } = await importModule("src/contactForm.mjs");
  const limits = { name: 4, email: 40, phone: 4, topic: 5, message: 7, schedule: 3 };

  const result = prepareContactForm({
    name: " Pessoa ",
    email: "pessoa@example.com",
    phone: " 123456 ",
    topic: " Contratos ",
    message: " Mensagem longa ",
    schedule: " tarde ",
  }, limits);

  assert.deepEqual(result.invalidFields, []);
  assert.deepEqual(result.cleaned, {
    name: "Pess",
    email: "pessoa@example.com",
    phone: "1234",
    topic: "Contr",
    message: "Mensage",
    schedule: "tar",
  });
});

test("contact form rejects every required field when absent or whitespace-only", async (t) => {
  const { prepareContactForm } = await importModule("src/contactForm.mjs");
  const limits = { name: 80, email: 120, phone: 30, topic: 120, message: 2000, schedule: 80 };
  const validForm = {
    name: "Pessoa",
    email: "pessoa@example.com",
    phone: "14999999999",
    topic: "Contratos",
    message: "Preciso de atendimento.",
    schedule: "manhã",
  };

  for (const field of ["name", "email", "topic", "message"]) {
    await t.test(`${field} absent`, () => {
      const form = { ...validForm };
      delete form[field];

      const result = prepareContactForm(form, limits);

      assert.deepEqual(result.invalidFields, [field]);
      assert.equal(result.cleaned[field], "");
    });

    await t.test(`${field} whitespace-only`, () => {
      const result = prepareContactForm({ ...validForm, [field]: " \t\n " }, limits);

      assert.deepEqual(result.invalidFields, [field]);
      assert.equal(result.cleaned[field], "");
    });
  }
});
