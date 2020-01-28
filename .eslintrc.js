module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:sonarjs/recommended",
    "plugin:functional/recommended",
    "plugin:functional/external-recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  env: {
    "jest/globals": true,
    es6: true
  },
  plugins: ["jest", "sonarjs", "functional", "@typescript-eslint", "prettier"],
  rules: {}
};
