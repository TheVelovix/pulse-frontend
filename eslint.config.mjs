import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      eqeqeq: "off",
      "@typescript-eslint/indent": "off",
      "arrow-parens": ["error", "as-needed"],
    },
  },
]);

export default eslintConfig;
