import { JUMPER_LEARN_PATH, pages } from '@/const/urls';
import { locales } from '@/i18n/i18next-locales';
import type { ChangeFrequency, SitemapPage } from '@/types/sitemap';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { MetadataRoute } from 'next';
import { getArticles } from './lib/getArticles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // paths
  const routes = pages.map((route: SitemapPage) => {
    return {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${route.path}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: route.priority,
      alternates: {
        languages: locales.reduce((acc, locale) => {
          return {
            ...acc,
            [locale !== 'en' ? locale : 'x-default']:
              `${process.env.NEXT_PUBLIC_SITE_URL}/${locale !== 'en' ? locale + '/' : ''}${route.path}`,
          };
        }, {}),
      },
    };
  });

  // articles by slug
  const articles = await getArticles().then(
    (article: StrapiResponse<BlogArticleData>) =>
      article.data.map((el) => {
        return {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}${JUMPER_LEARN_PATH}/${el.attributes.Slug}`,
          lastModified: new Date(
            el.attributes.updatedAt || el.attributes.publishedAt || Date.now(),
          )
            .toISOString()
            .split('T')[0],
          changeFrequency: 'weekly' as ChangeFrequency,
          alternates: {
            languages: locales.reduce((acc, locale) => {
              return {
                ...acc,
                [locale !== 'en' ? locale : 'x-default']:
                  `${process.env.NEXT_PUBLIC_SITE_URL}/${locale !== 'en' ? locale + '/' : ''}/${el.attributes.Slug}`,
              };
            }, {}),
          },
          priority: 0.8,
        };
      }),
  );

  return [...routes, ...articles];
}
