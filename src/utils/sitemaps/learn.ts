import { AppPaths } from '@/const/urls';
import { getArticles } from '@/app/lib/getArticles';
import type { BlogArticleData } from '@/types/strapi';
import { buildUrl, toSitemapDate } from '@/utils/sitemap';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import type { SitemapXmlEntry } from '@/utils/sitemaps/xml';
import { isProduction } from '@/utils/isProduction';

export const dynamic = 'force-static';

const SITEMAP_LIMIT = 50_000;
const ARTICLES_PAGE_SIZE = 100;
const DEV_CHUNK_SIZE = 20;
const strapiUrl = getStrapiBaseUrl();
const chunkSize = isProduction ? SITEMAP_LIMIT : DEV_CHUNK_SIZE;

const getArticlesTotal = async (): Promise<number> => {
  const { meta } = await getArticles(undefined, 1, 1, true);
  return meta.pagination.total;
};

const fetchArticlesChunk = async (
  chunkId: number,
): Promise<BlogArticleData[]> => {
  const start = chunkId * chunkSize;
  const firstPage = Math.floor(start / ARTICLES_PAGE_SIZE) + 1;
  const lastPage = Math.ceil((start + chunkSize) / ARTICLES_PAGE_SIZE);
  const pageRange = [...Array(lastPage - firstPage + 1).keys()].map(
    (index) => firstPage + index,
  );

  const pages = await Promise.all(
    pageRange.map((page) =>
      getArticles(undefined, ARTICLES_PAGE_SIZE, page, false).then(
        ({ data }) => data,
      ),
    ),
  );

  return pages.flat().slice(0, chunkSize);
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

  return articles.map(({ Slug, updatedAt, publishedAt, Image }) => ({
    loc: buildUrl(AppPaths.Learn, Slug),
    lastModified: toSitemapDate(updatedAt ?? publishedAt ?? Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
    images: Image?.url && strapiUrl ? [`${strapiUrl}${Image.url}`] : undefined,
  }));
};
