import { generateSitemaps as generateBridgeSitemaps } from '@/app/[lng]/bridge/sitemap';
import { generateSitemaps as generateLearnSitemaps } from '@/app/[lng]/(infos)/learn/sitemap';
import { getSiteUrl } from '@/const/urls';
import { isProduction } from '@/utils/isProduction';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Cannot have a sitemap index yet with app router, so we need to generate the sitemaps here
  const bridgeSitemaps = (await generateBridgeSitemaps()).map(
    (_, index) => `${getSiteUrl()}/en/bridge/sitemap/${index}.xml`,
  );
  const learnSitemaps = (await generateLearnSitemaps()).map(
    (_, index) => `${getSiteUrl()}/en/learn/sitemap/${index}.xml`,
  );
  return {
    rules: {
      userAgent: '*',
      disallow: '/scan',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: [`${getSiteUrl()}/sitemap.xml`].concat(
      learnSitemaps,
      bridgeSitemaps,
      `${getSiteUrl()}/en/swap/sitemap.xml`,
    ),
  };
}
