import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            '@next/next': nextPlugin,
            react: reactPlugin,
            'react-hooks': hooksPlugin,
            '@typescript-eslint': tseslint.plugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...hooksPlugin.configs.recommended.rules,
            '@next/next/no-html-link-for-pages': 'error',
            '@typescript-eslint/consistent-type-imports': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-shadow': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            'class-methods-use-this': 'off',
            'comma-dangle': ['error', 'always-multiline'],
            curly: 'warn',
            'import/extensions': 'off',
            'import/no-extraneous-dependencies': 'off',
            'import/no-unresolved': 'off',
            'import/prefer-default-export': 'off',
            indent: 'off',
            'jsx-quotes': ['error', 'prefer-double'],
            'linebreak-style': 'off',
            'max-len': 'off',
            'newline-per-chained-call': 'off',
            'no-bitwise': 'off',
            'no-console': ["error", { allow: ["warn", "error"] }],
            'no-continue': 'off',
            'no-nested-ternary': 'off',
            'no-param-reassign': 'off',
            'no-plusplus': 'off',
            'no-restricted-syntax': 'off',
            'no-shadow': 'off',
            '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
            'no-unused-vars': 'off',
            'no-var': 'warn',
            'object-curly-newline': 'off',
            'prettier/prettier': 'error',
            'react/function-component-definition': 'off',
            'react/jsx-filename-extension': [
                'warn',
                {
                    extensions: ['.ts', '.tsx'],
                },
            ],
            'react/jsx-one-expression-per-line': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/jsx-uses-react': 'off',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/require-default-props': 'off',
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true,
                },
            ],
            // Temporarily disable the problematic rule
            'react-hooks/exhaustive-deps': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        ignores: ['.next/*', 'node_modules/*'],
    },
];
