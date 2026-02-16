module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  env: { node: true, es2022: true },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: { "no-unused-vars": "off", "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }] },
    },
  ],
  ignorePatterns: ["bin/", "node_modules/", "tests/"],
};
