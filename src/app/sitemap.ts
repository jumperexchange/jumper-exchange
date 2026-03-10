import { AppPaths } from '@/const/urls';
import type { MetadataRoute } from 'next';
import { getArticles } from './lib/getArticles';
import type { SitemapPage } from '@/types/sitemap';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import { buildUrl, toSitemapDate, toSitemapEntry } from '@/utils/sitemap';

const strapiUrl = getStrapiBaseUrl();

export const pages: SitemapPage[] = [
  { path: AppPaths.Main, priority: 1.0 },
  { path: AppPaths.Learn, priority: 0.9 },
  { path: AppPaths.Earn, priority: 0.8 },
  { path: AppPaths.Portfolio, priority: 0.8 },
  { path: AppPaths.Profile, priority: 0.8 },
  { path: AppPaths.Gas, priority: 0.7 },
  { path: AppPaths.PrivacyPolicy, priority: 0.6 },
  { path: AppPaths.TermsOfBusiness, priority: 0.6 },
  { path: AppPaths.Newsletter, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = pages.map(({ path, priority }) =>
    toSitemapEntry(buildUrl(path), priority),
  );

  const { data } = await getArticles();

  const articles = data.map(({ Slug, updatedAt, publishedAt, Image }) =>
    toSitemapEntry(
      buildUrl(AppPaths.Learn, Slug),
      0.8,
      toSitemapDate(updatedAt ?? publishedAt ?? Date.now()),
      Image?.url && strapiUrl ? [`${strapiUrl}/${Image.url}`] : undefined,
    ),
  );

  return [...routes, ...articles];
}
