import type { MetadataRoute } from 'next';
import { isProduction } from '@/utils/isProduction';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: 'https://jumper.exchange/sitemap.xml',
  };
}
