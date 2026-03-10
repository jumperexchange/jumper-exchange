import { getSiteUrl } from '@/const/urls';
import type { MetadataRoute } from 'next';
import { removeTrailingSlash } from './removeTrailingSlash';

const siteUrl = getSiteUrl();

export const toSitemapDate = (date: string | number | Date): string =>
  new Date(date).toISOString().split('T')[0];

export const buildUrl = (...segments: string[]): string =>
  removeTrailingSlash([siteUrl, ...segments].join('/'));

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
