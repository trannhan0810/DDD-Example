import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
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
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
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
    },
  },
  {
    files: ['src/domain/**/**.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ regex: '(@application|@infrastructure)' }] }] },
  },
  {
    files: ['src/application/**/**.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ regex: '@infrastructure' }] }] },
  },
);
