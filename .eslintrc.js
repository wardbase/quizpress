module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	globals: {
		wp: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 11,
		sourceType: 'module',
	},
	plugins: [ 'react', '@typescript-eslint' ],
	rules: {
		'jsdoc/no-undefined-types': 'off',
		// Temporary silence to avoid the errors caused by the raw data from the server.
		camelcase: 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'jsx-a11y/label-has-for': 'off',
		'no-shadow': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/triple-slash-reference': 'off',
	},
};
