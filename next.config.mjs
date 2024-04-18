function redirectToHome(prefix = []) {
  return (path) => {
    return prefix.map((prefix) => ({
      source: `${prefix}${path}`,
      destination: '/',
      permanent: true,
    }));
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // config.externals.push('pino-pretty');
    return config;
  },
  async redirects() {
    return [
      '/active-transactions',
      '/bridges',
      '/exchanges',
      '/from-chain',
      '/from-token',
      '/languages',
      '/settings',
      '/routes',
      '/select-wallet',
      '/to-chain',
      '/to-token',
      '/to-token-native',
      '/transaction-details',
      '/transaction-execution',
      '/transaction-history',
      '/send-to-wallet',
      '/bookmarks',
      '/recent-wallets',
      '/connected-wallets',
      '/configured-wallets',
    ].map(redirectToHome(['/exchange', '/refuel'])).flat();
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'effigy.im',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi.li.finance',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mygateway.xyz',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jumper-static.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
