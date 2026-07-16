import type { ChangeFrequency } from '@/types/sitemap';

export type SitemapXmlEntry = {
  loc: string;
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  images?: string[];
};

export const SITEMAP_CACHE_CONTROL =
  'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800';

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const buildSitemapXml = (entries: SitemapXmlEntry[]): string => {
  const hasImages = entries.some((entry) => entry.images?.length);
  const urlSetTag = hasImages
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
    : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  const urls = entries
    .map((entry) => {
      const imageTags =
        entry.images?.map(
          (image) =>
            `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`,
        ) ?? [];

      return [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`,
        `    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        ...imageTags,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    urlSetTag,
    urls,
    '</urlset>',
    '',
  ].join('\n');
};

export const createSitemapXmlResponse = (entries: SitemapXmlEntry[]) =>
  new Response(buildSitemapXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': SITEMAP_CACHE_CONTROL,
    },
  });

export const buildSitemapIndexXml = (
  locs: string[],
  lastModified: string,
): string => {
  const sitemaps = locs
    .map((loc) =>
      [
        '  <sitemap>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${escapeXml(lastModified)}</lastmod>`,
        '  </sitemap>',
      ].join('\n'),
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    sitemaps,
    '</sitemapindex>',
    '',
  ].join('\n');
};

export const createSitemapIndexXmlResponse = (
  locs: string[],
  lastModified: string,
) =>
  new Response(buildSitemapIndexXml(locs, lastModified), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': SITEMAP_CACHE_CONTROL,
    },
  });

export const createSitemapServiceUnavailableResponse = () =>
  new Response('Service Unavailable', {
    status: 503,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Retry-After': '3600',
      'Cache-Control': 'no-store',
    },
  });
