import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    // Unreferenced standalone prototype; the routed application uses src/pages/*.
    "src/ResumeBuilder.jsx",
  ]),
  {
    files: ["src/**/*.{js,jsx}", "*.js", "*.jsx"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/context/*.jsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["src/context/ResumeContext.jsx"],
    rules: {
      // This effect resets account-scoped state when the authenticated account changes.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/components/resume/ResumePDF.jsx"],
    rules: {
      // React-PDF uses local stateless render helpers to construct document sections.
      "react-hooks/static-components": "off",
    },
  },
  {
    files: ["src/components/resume/ResumePreview.jsx"],
    rules: {
      "no-control-regex": "off",
    },
  },
]);
