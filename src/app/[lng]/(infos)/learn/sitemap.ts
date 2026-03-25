import { AppPaths } from '@/const/urls';
import { getArticles } from '@/app/lib/getArticles';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import { buildUrl, toSitemapDate, toSitemapEntry } from '@/utils/sitemap';
import type { BlogArticleData } from '@/types/strapi';
import type { MetadataRoute } from 'next';
import { isProduction } from '@/utils/isProduction';

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
    (i) => firstPage + i,
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

export async function generateSitemaps() {
  if (!isProduction) {
    return [{ id: '0' }];
  }

  try {
    const total = await getArticlesTotal();
    const numberOfChunks = Math.ceil(total / SITEMAP_LIMIT);
    return [...Array(numberOfChunks).keys()].map((id) => ({ id: String(id) }));
  } catch (error) {
    console.warn('Failed to fetch articles for learn sitemap:', error);
    return [{ id: '0' }];
  }
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const articles = await fetchArticlesChunk(id);

  return articles.map(({ Slug, updatedAt, publishedAt, Image }) =>
    toSitemapEntry(
      buildUrl(AppPaths.Learn, Slug),
      0.8,
      toSitemapDate(updatedAt ?? publishedAt ?? Date.now()),
      Image?.url && strapiUrl ? [`${strapiUrl}${Image.url}`] : undefined,
    ),
  );
}
