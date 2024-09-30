import { JUMPER_LEARN_PATH, pages } from '@/const/urls';
import type { ChangeFrequency, SitemapPage } from '@/types/sitemap';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { MetadataRoute } from 'next';
import { getArticles } from './lib/getArticles';
import { locales } from 'src/i18n';

function withoutTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function generateAlternates(path: string) {
  return {
    languages: {
      ...locales.reduce((acc, loc) => {
        const pages = {
          ...acc,
          [loc]: withoutTrailingSlash(
            `${process.env.NEXT_PUBLIC_SITE_URL}${loc !== 'en' ? `/${loc}` : ''}${path}`,
          ),
        };

        return pages;
      }, {}),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // paths
  const routes = pages.flatMap((route: SitemapPage) => {
    return locales.map((locale) => {
      return {
        url: withoutTrailingSlash(
          `${process.env.NEXT_PUBLIC_SITE_URL}${locale !== 'en' ? `/${locale}` : ''}${route.path}`,
        ),
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as ChangeFrequency,
        alternates: generateAlternates(route.path),
        priority: route.priority,
      };
    });
  });

  // articles by slug
  const articles = await getArticles().then(
    (article: StrapiResponse<BlogArticleData>) => {
      return locales.flatMap((locale) => {
        return article.data.map((el) => {
          return {
            url: withoutTrailingSlash(
              `${process.env.NEXT_PUBLIC_SITE_URL}${locale !== 'en' ? `/${locale}` : ''}${JUMPER_LEARN_PATH}${el.attributes.Slug}`,
            ),
            lastModified: new Date(
              el.attributes.updatedAt ||
                el.attributes.publishedAt ||
                Date.now(),
            )
              .toISOString()
              .split('T')[0],
            changeFrequency: 'weekly' as ChangeFrequency,
            alternates: generateAlternates(
              `${JUMPER_LEARN_PATH}${el.attributes.Slug}`,
            ),
            priority: 0.8,
          };
        });
      });
    },
  );

  return [...routes, ...articles];
}
