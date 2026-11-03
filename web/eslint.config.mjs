/*
 * JANCO FILE DOCUMENTATION
 * Purpose: Configures or provides eslint config functionality for the customer and janitor PWA.
 * Why: It groups this functionality for reuse or execution within the project.
 * Uses or links to: None identified by static analysis; framework, runtime, or external consumers may exist.
 * Imported or linked from: None identified by static analysis; framework, runtime, or external consumers may exist.
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "prefer-const": "off",
      "no-restricted-syntax": ["error",
        { "selector": "JSXAttribute[name.name='dangerouslySetInnerHTML']", "message": "Raw HTML is not allowed; render user content as React text." },
        { "selector": "MemberExpression[property.name='innerHTML']", "message": "Raw DOM HTML is not allowed." },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
