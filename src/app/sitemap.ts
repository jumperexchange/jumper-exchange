import { getSiteUrl, JUMPER_LEARN_PATH, pages } from '@/const/urls';
import type { ChangeFrequency, SitemapPage } from '@/types/sitemap';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { MetadataRoute } from 'next';
import { getArticles } from './lib/getArticles';
import { locales } from 'src/i18n';

function withoutTrailingSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // paths
  const routes = pages.flatMap((route: SitemapPage) => {
    return {
      url: withoutTrailingSlash(`${getSiteUrl()}${route.path}`),
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: route.priority,
    };
  });

  // articles by slug
  const articles = await getArticles().then(
    (article: StrapiResponse<BlogArticleData>) => {
      return article.data.map((el) => {
        return {
          url: withoutTrailingSlash(
            `${getSiteUrl()}${JUMPER_LEARN_PATH}/${el?.Slug}`,
          ),
          lastModified: new Date(el?.updatedAt || el?.publishedAt || Date.now())
            .toISOString()
            .split('T')[0],
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.8,
        };
      });
    },
  );

  return [...routes, ...articles];
}
