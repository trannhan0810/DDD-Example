import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['dist/**/*.ts', 'dist/**', 'eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: importPlugin },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': { typescript: true, node: true },
    },
  },
  {
    rules: {
      'prefer-template': ['error'],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      'import/order': [
        'error',
        {
          named: true,
          alphabetize: { order: 'asc' },
          ['newlines-between']: 'always',
          groups: ['builtin', ['sibling', 'parent'], 'index', 'object', 'internal', 'external', 'type'],
        },
      ],
      'import/no-restricted-paths': [
        'error',
        {
          basePath: './',
          zones: [
            { target: './src/domain/', from: ['./src/application/', './src/infrastructure/'] },
            { target: './src/application/', from: './src/infrastructure/' },
            { target: './src/shared/', from: './src/!(shared)/**/*' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/**.use-case.ts'],
    rules: { '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }] },
  },
);
