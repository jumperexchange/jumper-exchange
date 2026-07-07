import i18nConfig from 'i18n-config';
import { AppPaths } from '@/const/urls';
import type { SitemapPage } from '@/types/sitemap';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';

const pages: SitemapPage[] = [
  { path: AppPaths.Main, priority: 1.0 },
  { path: AppPaths.Learn, priority: 0.9 },
  { path: AppPaths.Earn, priority: 0.8 },
  { path: AppPaths.Portfolio, priority: 0.8 },
  { path: AppPaths.Missions, priority: 0.8 },
  { path: AppPaths.Profile, priority: 0.8 },
  { path: AppPaths.Gas, priority: 0.7 },
  { path: AppPaths.PrivacyPolicy, priority: 0.6 },
  { path: AppPaths.TermsOfBusiness, priority: 0.6 },
  { path: AppPaths.Newsletter, priority: 0.5 },
];

export const getRootSitemapEntries = (
  lastModified = toSitemapDate(Date.now()),
): SitemapXmlEntry[] => {
  const entries: SitemapXmlEntry[] = [];

  for (const { path, priority } of pages) {
    // Canonical (no locale prefix)
    entries.push({
      loc: buildUrl(path),
      lastModified,
      changeFrequency: 'weekly',
      priority,
    });

    // Locale variants (skip default locale — it serves the unprefixed canonical URL)
    for (const locale of i18nConfig.locales.filter(
      (l) => l !== i18nConfig.defaultLocale,
    )) {
      entries.push({
        loc: buildUrl(locale, path),
        lastModified,
        changeFrequency: 'weekly',
        priority,
      });
    }
  }

  return entries;
};
