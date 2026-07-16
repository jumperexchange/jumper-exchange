import { getSiteUrl } from '@/const/urls';
import { buildUrl } from '@/utils/sitemap';
import { isProduction } from '@/utils/isProduction';
import { getLearnSitemapChunkIds } from '@/utils/sitemaps/learn';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400;

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Bridge uses a sitemap index; learn/swap remain listed directly until indexed similarly.
  const learnSitemaps = (await getLearnSitemapChunkIds()).map((id) =>
    buildUrl('learn', 'sitemap', `${id}.xml`),
  );

  return {
    rules: {
      userAgent: '*',
      disallow: '/scan',
      ...(isProduction && { allow: '/' }),
      ...(!isProduction && { disallow: '/' }),
    },
    sitemap: [
      buildUrl('sitemap.xml'),
      ...learnSitemaps,
      buildUrl('bridge', 'sitemap.xml'),
      buildUrl('swap', 'sitemap.xml'),
    ],
  };
}
