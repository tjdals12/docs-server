module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		mocha: true
	},
	extends: 'eslint:recommended',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	rules: {
		indent: ['error', 4, { "SwitchCase": 1 }],
		semi: ['error', 'always'],
		quotes: ['error', 'single'],
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
		'no-console': 'off'
	}
};
