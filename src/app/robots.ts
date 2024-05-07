import type { MetadataRoute } from 'next';
import getConfig from 'next/config';

export default function robots(): MetadataRoute.Robots {
  const { serverRuntimeConfig } = getConfig();

  const isProduction = serverRuntimeConfig.environment === 'production';

  console.log('process', process.env.NODE_ENV, serverRuntimeConfig.environment);
  return {
    rules: {
      userAgent: '*',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: 'https://jumper.exchange/sitemap.xml',
  };
}
