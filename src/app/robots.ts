import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.ENV_NAME === 'prod';

  return {
    rules: {
      userAgent: '*',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: 'https://jumper.exchange/sitemap.xml',
  };
}
