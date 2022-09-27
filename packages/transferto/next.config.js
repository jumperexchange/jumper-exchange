const withTM = require('next-transpile-modules')([
  '@transferto/shared',
  '@lifi/widget',
  '@transferto/dashboard-old',
]);
module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
  i18n: {
    /**
     * Provide the locales you want to support in your application
     */
    locales: ['en-US', 'de-DE'], //, "fr-FR", "es-ES"
    /**
     * This is the default locale you want to be used when visiting
     * a non-locale prefixed path.
     */
    defaultLocale: 'en-US',
  },
});
