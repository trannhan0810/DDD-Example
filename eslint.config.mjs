import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['**.config.js', 'jest.preset.js'],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  }
);
