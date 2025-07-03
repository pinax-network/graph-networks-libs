import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    // Base configuration for all TS files
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'no-console': 'off',
      'no-prototype-builtins': 'off',
      'no-undef': 'off', // TypeScript handles this better
      'no-empty': 'warn',
      'no-unused-vars': 'off', // Using TypeScript's version instead
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // Special configuration for test files
    files: ['**/__tests__/**/*.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        NodeJS: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    // Special configuration for generated types
    files: ['**/types.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-empty': 'off',
    },
  },
];