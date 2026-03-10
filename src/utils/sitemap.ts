import { getSiteUrl } from '@/const/urls';
import type { MetadataRoute } from 'next';

const siteUrl = getSiteUrl();

const stripSlashes = (path: string) => {
  return path.replace(/^\/+|\/+$/g, '');
};

export const toSitemapDate = (date: string | number | Date): string =>
  new Date(date).toISOString().split('T')[0];

export const buildUrl = (...segments: string[]): string =>
  [siteUrl, ...segments].map(stripSlashes).join('/');

export const toSitemapEntry = (
  url: string,
  priority: number,
  lastModified = toSitemapDate(Date.now()),
  images?: string[],
): MetadataRoute.Sitemap[number] => ({
  url,
  lastModified,
  changeFrequency: 'weekly',
  priority,
  ...(images?.length ? { images } : {}),
});
