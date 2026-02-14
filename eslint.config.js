/**
 * ===================================================================
 * ESLINT CONFIG
 * ===================================================================
 * - Applique des règles de qualité de code cohérentes
 * - Sépare backend (Node.js) et frontend (Browser)
 * - Évite les faux positifs liés aux environnements différents
 * ===================================================================
 * Architecture :
 * - src/       → backend Express
 * - public/    → frontend JS (Browser globals)
 * ===================================================================
 */

import js from "@eslint/js";
import globals from "globals";

export default [

  // ======================================================
  // BACKEND (Node.js) - Express API
  // ======================================================
  {
    files: ["src/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      ...js.configs.recommended.rules,

      // Autorise console.log pour debug
      "no-console": ["warn", { allow: ["warn", "error", "info"]}],
      // Warn seulement + ignore les arguements commençant par "_"
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // ======================================================
  // FRONTEND (Browser) - UI Script
  // ======================================================
  {
    files: ["public/**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      ...js.configs.recommended.rules,

      // Autorise console.log pour debug
      "no-console": ["warn", { allow: ["warn", "error", "info"]}],
      // Warn seulement + ignore les arguements commençant par "_"
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

];