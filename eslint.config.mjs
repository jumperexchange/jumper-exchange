// ESLint Flat Config for Next.js 16
// See: https://nextjs.org/docs/app/api-reference/config/eslint
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';

const eslintConfig = defineConfig([
  // Global ignores
  globalIgnores([
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/build/**',
    '**/*.d.ts',
    '**/coverage/**',
    '**/.turbo/**',
    '**/out/**',
    '**/playwright-report/**',
    '**/test-results/**',
    '**/__blobstorage__/**',
    '**/.storybook/**',
    '**/src/**/**.stories.tsx',
  ]),

  jsxA11y.flatConfigs.recommended,

  // TypeScript configuration
  ...tseslint.configs.recommended,

  // Next.js plugin configuration
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // Prettier config (disables conflicting rules)
  prettierConfig,

  // React Hooks plugin configuration
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Custom rules
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-shadow': 'off',

      // General rules
      'class-methods-use-this': 'off',
      'comma-dangle': ['warn', 'always-multiline'],
      curly: 1,
      'jsx-quotes': ['error', 'prefer-double'],
      'linebreak-style': 'off',
      'max-len': 'off',
      'newline-per-chained-call': 'off',
      'no-bitwise': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-console': [
        'error',
        {
          allow: ['log', 'group', 'groupEnd', 'error', 'warn', 'debug'],
        },
      ],
      'no-continue': 'off',
      'no-implicit-any-catch': 'off',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
      'no-shadow': 'off',
      'no-unused-expressions': 'warn',
      'no-unused-vars': 'off',
      'no-var': 'warn',
      'object-curly-newline': 'off',
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
    },
  },
]);

export default eslintConfig;
