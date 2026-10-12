export const contactFixture = 'https://contact.example.test/request';

export const browserBuildConfig = {
  configFile: false,
  envFile: false,
  logLevel: 'error',
  define: {
    'import.meta.env.VITE_CONTACT_FORM_ENDPOINT': JSON.stringify(contactFixture),
    'import.meta.env.VITE_PRIVACY_POLICY_URL': JSON.stringify('https://privacy.example.test/policy'),
  },
  build: { outDir: '.tmp/qa-browser-build' },
};
