import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // Walletconnect configuration is blocking the build, pino-pretty needs to be added as an external
    config.externals.push('pino-pretty');
    //trying to reduce RAM usage
    if (config.cache) {
      config.cache = Object.freeze({
        type: 'memory',
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sei.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.debank.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi-staging.jumper.exchange',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi.jumper.exchange',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/jumper-static-assets/upload/**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.mygateway.xyz',
      //   port: '',
      //   pathname: '/**',
      // },
      {
        protocol: 'https',
        hostname: '*.etherscan.io',
        port: '',
        pathname: '/token/images/**',
      },
      {
        protocol: 'https',
        hostname: 'resolve.mercle.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.gravity.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // TODO: this one can be dangerous
        port: '',
        pathname: '/lifinance/types/main/src/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.debank.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sei.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.etherscan.io',
        port: '',
        pathname: '/token/images/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:lng?/swap',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:lng?/exchange',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:lng?/refuel',
        destination: '/gas',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    // Cannot use `isProduction` here, as this file is not supporting ts
    enabled: process.env.ENV_NAME === 'prod',
    // Suppresses source map uploading logs during build
    silent: true,
    org: 'jumper-exchange',
    project: 'jumper-front',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
    bundlePagesRouterDependencies: true,
  },
);
