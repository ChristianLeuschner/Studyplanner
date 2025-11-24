import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Configuration for ignoring files
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Apply this configuration only to TypeScript files
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Temporarily set the 'no-explicit-any' rule to 'off'
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;