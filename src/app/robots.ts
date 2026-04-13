import { getSiteUrl } from '@/const/urls';
import { getBridgeSitemapChunkIds } from '@/utils/sitemaps/bridge';
import { isProduction } from '@/utils/isProduction';
import { getLearnSitemapChunkIds } from '@/utils/sitemaps/learn';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Cannot have a sitemap index yet with app router, so we list chunked sitemap URLs here.
  const bridgeSitemaps = (await getBridgeSitemapChunkIds()).map(
    (id) => `${getSiteUrl()}/bridge/sitemap/${id}.xml`,
  );
  const learnSitemaps = (await getLearnSitemapChunkIds()).map(
    (id) => `${getSiteUrl()}/learn/sitemap/${id}.xml`,
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
      `${getSiteUrl()}/swap/sitemap.xml`,
    ),
  };
}
