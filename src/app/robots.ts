import type { MetadataRoute } from 'next';
import { isProduction } from '@/utils/isProduction';
import { generateSitemaps } from '@/app/[lng]/bridge/sitemap';
import { getSiteUrl } from '@/const/urls';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Cannot have a sitemap index yet with app router, so we need to generate the sitemaps here
  const bridgeSitemaps = (await generateSitemaps()).map(
    (_, index) => `${getSiteUrl()}/en/bridge/sitemap/${index}.xml`,
  );

  return {
    rules: {
      userAgent: '*',
      disallow: '/scan',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: [`${getSiteUrl()}/sitemap.xml`].concat(bridgeSitemaps),
  };
}
