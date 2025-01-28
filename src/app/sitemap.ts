import {
  getSiteUrl,
  JUMPER_LEARN_PATH,
  JUMPER_SWAP_PATH,
  pages,
} from '@/const/urls';
import type { ChangeFrequency, SitemapPage } from '@/types/sitemap';
import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import type { MetadataRoute } from 'next';
import { getChainsQuery } from 'src/hooks/useChains';
import { removeTrailingSlash } from 'src/utils/removeTrailingSlash';
import { getArticles } from './lib/getArticles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // paths
  const routes = pages.flatMap((route: SitemapPage) => {
    return {
      url: removeTrailingSlash(`${getSiteUrl()}${route.path}`),
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
          url: removeTrailingSlash(
            `${getSiteUrl()}${JUMPER_LEARN_PATH}/${el.attributes.Slug}`,
          ),
          lastModified: new Date(
            el.attributes?.updatedAt ||
              el.attributes?.publishedAt ||
              Date.now(),
          )
            .toISOString()
            .split('T')[0],
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.8,
        };
      });
    },
  );

  // swap pages
  const { chains } = await getChainsQuery();
  const swapPages = chains.map((chain) => {
    return {
      url: removeTrailingSlash(
        `${getSiteUrl()}${JUMPER_SWAP_PATH}/${chain.name}`
          .replace(' ', '-')
          .toLowerCase(),
      ),
      lastModified: new Date().toISOString().split('T')[0],
      priority: 0.4,
    };
  });

  return [...routes, ...articles, ...swapPages];
}
