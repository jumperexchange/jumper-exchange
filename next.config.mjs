/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // Walletconnect configuration is blocking the build, pino-pretty needs to be added as an external
    config.externals.push('pino-pretty');
    return config;
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
      {
        protocol: 'https',
        hostname: 'resolve.mercle.xyz',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/exchange',
        destination: '/',
        permanent: true,
      },
      {
        source: '/swap',
        destination: '/',
        permanent: true,
      },
      {
        source: '/refuel',
        destination: '/gas',
        permanent: true,
      },
      {
        source: '/:lng/swap',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:lng/exchange',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:lng/refuel',
        destination: '/gas',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
