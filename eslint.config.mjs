import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});


const eslintConfig = defineConfig([
  globalIgnores(["**/node_modules/**/*", "**/dist/**/*", "**/build/**/*", "**/*.d.ts"]),
  ...compat.config({
    'extends': [
      'plugin:prettier/recommended',
      'plugin:@next/next/recommended',
    ],
    'rules': {
      'class-methods-use-this': 'off',
      'comma-dangle': [
        'error',
        'always-multiline',
      ],
      'curly': 1,
      'import/extensions': 'off',
      // "import/no-default-export": "error",
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 0,
      'import/prefer-default-export': 'off',
      'indent': 'off',
      'jsx-quotes': [
        'error',
        'prefer-double',
      ],
      'linebreak-style': 'off',
      'max-len': 'off',
      'newline-per-chained-call': 'off',
      'no-bitwise': 'off',
      'no-console': [
        'error',
        {
          'allow': [
            'error',
            'warn',
            'debug',
          ],
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
      'prettier/prettier': 'error',
      'quotes': [
        'error',
        'single',
        {
          'avoidEscape': true,
          'allowTemplateLiterals': true,
        },
      ],
    },
  }),
]);

export default eslintConfig;
