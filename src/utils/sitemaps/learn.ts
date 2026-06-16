import { getSitemapArticles } from '@/app/lib/getArticles';
import { AppPaths } from '@/const/urls';
import type { BlogArticleData } from '@/types/strapi';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import { resolveStrapiMediaUrl } from '@/utils/strapi/strapiHelper';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';
import { isProduction } from '@/utils/isProduction';

export const dynamic = 'force-static';

const SITEMAP_LIMIT = 50_000;
const ARTICLES_PAGE_SIZE = 100;
const DEV_CHUNK_SIZE = 20;
const FETCH_CONCURRENCY = 5;
const chunkSize = isProduction ? SITEMAP_LIMIT : DEV_CHUNK_SIZE;

export const getLearnSitemapPageRange = (
  chunkId: number,
  total: number,
  articlesChunkSize: number,
  pageSize: number,
): number[] => {
  const start = chunkId * articlesChunkSize;
  if (start >= total) {
    return [];
  }

  const articlesInChunk = Math.min(articlesChunkSize, total - start);
  const firstPage = Math.floor(start / pageSize) + 1;
  const lastPage = Math.ceil((start + articlesInChunk) / pageSize);

  return Array.from(
    { length: lastPage - firstPage + 1 },
    (_, index) => firstPage + index,
  );
};

const getArticlesTotal = async (): Promise<number> => {
  const { meta } = await getSitemapArticles(1, 1, true);
  return meta.pagination.total;
};

const fetchArticlesPage = async (page: number): Promise<BlogArticleData[]> => {
  const { data } = await getSitemapArticles(page, ARTICLES_PAGE_SIZE, false);
  return data;
};

const fetchInBatches = async (
  pages: number[],
  concurrency: number,
): Promise<BlogArticleData[]> => {
  const articles: BlogArticleData[] = [];

  for (let index = 0; index < pages.length; index += concurrency) {
    const batch = pages.slice(index, index + concurrency);
    const batchArticles = await Promise.all(batch.map(fetchArticlesPage));
    articles.push(...batchArticles.flat());
  }

  return articles;
};

const fetchArticlesChunk = async (
  chunkId: number,
): Promise<BlogArticleData[]> => {
  const total = await getArticlesTotal();
  const pageRange = getLearnSitemapPageRange(
    chunkId,
    total,
    chunkSize,
    ARTICLES_PAGE_SIZE,
  );

  if (pageRange.length === 0) {
    return [];
  }

  const articles = await fetchInBatches(pageRange, FETCH_CONCURRENCY);
  return articles.slice(0, chunkSize);
};

export const getLearnSitemapChunkIds = async (): Promise<string[]> => {
  if (!isProduction) {
    return ['0'];
  }

  const total = await getArticlesTotal();
  const numberOfChunks = Math.ceil(total / SITEMAP_LIMIT);
  return Array.from({ length: numberOfChunks }, (_, index) => String(index));
};

export const getLearnSitemapEntriesForChunk = async (
  chunkId: number,
): Promise<SitemapXmlEntry[]> => {
  const articles = await fetchArticlesChunk(chunkId);

  return articles.map(({ Slug, updatedAt, publishedAt, Image }) => {
    const imageUrl = resolveStrapiMediaUrl(Image?.url);
    return {
      loc: buildUrl(AppPaths.Learn, Slug),
      lastModified: toSitemapDate(updatedAt ?? publishedAt ?? Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
      images: imageUrl ? [imageUrl] : undefined,
    };
  });
};
