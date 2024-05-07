import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';

  console.log('process', process.env.NODE_ENV);
  return {
    rules: {
      userAgent: '*',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: 'https://jumper.exchange/sitemap.xml',
  };
}
