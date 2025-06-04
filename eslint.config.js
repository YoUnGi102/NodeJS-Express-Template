import js from "@eslint/js";
import tseslint from "typescript-eslint";
import path from "node:path";

export default [
	{
		ignores: ["dist/**", "node_modules/**", "coverage/**", "*.log", ".env"],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.eslint.json",
				tsconfigRootDir: path.resolve(), // or import.meta.dirname if you're sure it's supported
			},
		},
		rules: {
			"no-console": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ argsIgnorePattern: "^_" },
			],
		},
	},
	{
		files: ["**/*.interface.ts"],
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
];
