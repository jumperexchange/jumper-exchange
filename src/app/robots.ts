import type { MetadataRoute } from 'next';
import { isProduction } from '@/utils/isProduction';
import { generateSitemaps } from '@/app/bridge/sitemap';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Cannot have a sitemap index yet with app router, so we need to generate the sitemaps here
  const bridgeSitemaps = (await generateSitemaps()).map(
    (_, index) =>
      `${process.env.NEXT_PUBLIC_SITE_URL}/bridge/sitemap/${index}.xml`,
  );

  return {
    rules: {
      userAgent: '*',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: [`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`].concat(
      bridgeSitemaps,
    ),
  };
}
