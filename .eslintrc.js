module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint"
	],
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			modules: true
		}
	},
	rules: {
		"no-unused-vars": "off",
		"no-invalid-this": "off",
		"multiline-ternary": 0,
		"curly": ["error", "multi-line"],
		"lines-between-class-members": "off",
		"space-before-function-paren": ["error", {
			"anonymous": "never",
			"named": "never",
			"asyncArrow": "always"
		}],
		"new-cap": "off",
		"no-mixed-spaces-and-tabs": "off"
	},
	extends: [
		"eslint-config-codesupport"
	]
};