import { fixupConfigRules } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...fixupConfigRules(
		compat.extends(
			'airbnb',
			'prettier',
			'eslint:recommended',
			'plugin:import/errors',
			'plugin:import/warnings',
			'plugin:node/recommended',
			'plugin:prettier/recommended',
		),
	),
	{
		languageOptions: {
			ecmaVersion: 12,
			sourceType: 'module',
		},

		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			},
		},
		rules: {
			'no-console': 'warn',
			'func-names': 'off',
			'spaced-comment': 'off',
			'no-return-await': 'off',
			'no-process-exit': 'off',
			'object-shorthand': 'off',
			'consistent-return': 'off',
			'no-param-reassign': 'off',
			'prettier/prettier': 'error',
			'no-underscore-dangle': 'off',
			'import/no-unresolved': 'off',
			'no-unpublished-import': 'off',
			'class-methods-use-this': 'off',
			'import/no-extraneous-dependencies': [
				'error',
				{ devDependencies: true },
			],

			curly: ['error', 'all'],

			'prefer-destructuring': [
				'error',
				{
					object: true,
					array: false,
				},
			],

			'no-unused-vars': [
				'error',
				{
					argsIgnorePattern: 'req|res|next|val',
				},
			],
		},
	},
];
