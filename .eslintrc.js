module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module",
		ecmaVersion: 2020,
	},
	plugins: ["@typescript-eslint/eslint-plugin", "react", "prettier", "import", "react-hooks"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:import/typescript",
		"plugin:import/errors",
	],
	root: true,
	env: {
		node: true,
		jest: true,
		es2020: true,
	},
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			typescript: {},
		},
	},
	ignorePatterns: [".eslintrc.js", "dist", "server", "node_modules", "coverage"],
	rules: {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
	// React
	"react/prop-types": "off",
	"react/react-in-jsx-scope": "off",
	"react-hooks/rules-of-hooks": "error",
	"react-hooks/exhaustive-deps": "warn",
	"import/order": [
		"error",
		{
			groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
			"newlines-between": "always",
			alphabetize: {
				order: "asc",
			},
		},
	],
};
