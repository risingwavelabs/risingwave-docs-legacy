module.exports = {
  extends: ["plugin:@docusaurus/recommended"],
  plugins: ["@docusaurus"],
  rules: {
    "@docusaurus/no-untranslated-text": ["warn", { ignoredStrings: ["·", "—", "×"] }],
  },
};
