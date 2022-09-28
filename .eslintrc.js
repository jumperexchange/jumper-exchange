const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  extends: ['react-app', 'plugin:security/recommended'],
  plugins: ['security', 'simple-import-sort'],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'max-params': 'error',
    'security/detect-object-injection': 'off',
    'array-callback-return': 'off',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-console': isDev ? 'off' : 'error',
    'no-debugger': isDev ? 'off' : 'error',
    'react-hooks/exhaustive-deps': 'off',
  },
}
