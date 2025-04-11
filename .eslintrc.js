module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module",
		ecmaVersion: 2023,
	},
	plugins: ["@typescript-eslint/eslint-plugin", "react", "prettier", "import", "react-hooks"],
	extends: [
		"eslint:recommended",
		"plugin:import/typescript",
		"plugin:import/errors",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:prettier/recommended",
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es2023: true,
	},
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	ignorePatterns: [".eslintrc.js", "dist", "server", "node_modules", "coverage", "build"],
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "warn", // Changed to warn instead of off
		"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		"@typescript-eslint/no-floating-promises": "error",

		// React
		"react/prop-types": "off",
		"react/react-in-jsx-scope": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",

		// Import
		"import/order": [
			"error",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					["parent", "sibling"],
					"index",
					"object",
					"type",
				],
				"newlines-between": "always",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
		"import/no-duplicates": "error",

		// General
		"no-console": ["warn", { allow: ["warn", "error", "info"] }],
		"prefer-const": "error",
		eqeqeq: ["error", "always", { null: "ignore" }],
	},
};
