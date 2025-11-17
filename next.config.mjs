import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  experimental: {
    serverSourceMaps: false,
    optimizePackageImports: ['recharts'],
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // Walletconnect configuration is blocking the build, pino-pretty needs to be added as an external
    config.externals.push('pino-pretty', 'pino', 'thread-stream');
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

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

export default withSentryConfig(withBundleAnalyzerConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/

  org: 'jumper-exchange',
  project: 'jumper-front',

  // For providing readable stack traces for errors using source maps, we need to setup the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppresses source map uploading logs during build
  silent: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  sourcemaps: {
    disable: false, // Source maps are enabled by default
    assets: ['**/*.js', '**/*.js.map'], // Specify which files to upload
    ignore: ['**/node_modules/**'], // Files to exclude
    deleteSourcemapsAfterUpload: true, // Security: delete after upload
  },

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
  bundlePagesRouterDependencies: true,
  reactComponentAnnotation: {
    enabled: true,
  },
});
