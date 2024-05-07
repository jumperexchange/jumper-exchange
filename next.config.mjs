/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  trailingSlash: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    environment: process.env.NODE_ENV ?? 'production',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // config.externals.push('pino-pretty');
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
    ],
  },
};

export default nextConfig;
