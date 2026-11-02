import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "src/styles/vendor/",
      "docs/",
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommended,
  // .astro: regras do Astro + acessibilidade (jsx-a11y) na marcação
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],

  // código do navegador
  {
    files: ["src/**/*.{ts,astro}"],
    languageOptions: { globals: globals.browser },
  },
  // scripts de build (Node)
  {
    files: ["scripts/**/*.mjs", "astro.config.mjs", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    rules: { "no-console": "off" },
  },
);
