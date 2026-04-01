import { AppPaths } from '@/const/urls';
import type { MetadataRoute } from 'next';
import type { SitemapPage } from '@/types/sitemap';
import { buildUrl, toSitemapEntry } from '@/utils/sitemap';

export const dynamic = 'force-static';

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
  return pages.map(({ path, priority }) =>
    toSitemapEntry(buildUrl(path), priority),
  );
}
