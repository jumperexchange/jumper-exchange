import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is for the Docker image; for the e2e prod-build server we want a
  // plain build that `next start` serves cleanly (E2E_PROD_BUILD).
  output: process.env.E2E_PROD_BUILD ? undefined : 'standalone',
  trailingSlash: false,
  reactCompiler: true,
  productionBrowserSourceMaps: false,
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    '@opentelemetry/exporter-metrics-otlp-grpc',
    '@opentelemetry/host-metrics',
    'ioredis',
  ],
  cacheHandlers: process.env.NODE_ENV === 'production'
    ? { default: require.resolve('./cache-handler.cjs') }
    : undefined,
  // Classic incremental cache (ISR/prerender route output) shared via Redis.
  // Distinct from `cacheHandlers` above, which only backs the `"use cache"`
  // directive and does NOT store ISR route output.
  cacheHandler:
    process.env.NODE_ENV === 'production'
      ? require.resolve('./cache-handler-incremental.cjs')
      : undefined,
  expireTime: 86400, // one day in seconds
  experimental: {
    serverSourceMaps: false,
    optimizePackageImports: [],
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
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
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
        hostname: 'strapi-develop.jumper.xyz',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi.jumper.xyz',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/jumper-static-assets/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/jumper-strapi-media-dev/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/jumper-strapi-media-staging/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/jumper-strapi-media-prod/uploads/**',
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

  // Suppress noisy sentry-cli progress output in CI logs.
  silent: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: false,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  sourcemaps: {
    disable: process.env.VERCEL === '1', // Disable on Vercel to avoid timeouts
    assets: ['**/*.js', '**/*.js.map'], // Specify which files to upload
    ignore: ['**/node_modules/**'], // Files to exclude
    deleteSourcemapsAfterUpload: true, // Security: delete after upload
  },

  telemetry: false,

  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,

  webpack: {
    reactComponentAnnotation: {
      enabled: true,
    },
  },
});
