import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

const DEFAULT_PAGE_SIZE = 20;
const SITEMAP_FETCH_RETRIES = 3;

const fetchWithRetry = async (
  url: string,
  init: RequestInit,
): Promise<Response> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < SITEMAP_FETCH_RETRIES; attempt++) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < SITEMAP_FETCH_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
};

export async function getSitemapArticles(
  page: number,
  pageSize: number,
  withCount = false,
): Promise<StrapiResponse<BlogArticleData>> {
  const urlParams = new ArticleStrapiApi({
    includeFields: ['Slug', 'publishedAt', 'updatedAt'],
    populate: ['Image'],
  })
    .sort('desc')
    .addPaginationParams({
      page,
      pageSize,
      withCount,
    });
  const apiUrl = decodeURIComponent(urlParams.getApiUrl());
  const res = await fetchWithRetry(apiUrl, {
    next: {
      revalidate: 60 * 5,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch sitemap articles');
  }

  const responseData = await res.json();
  return {
    meta: responseData.meta,
    data: responseData.data,
  };
}

export async function getArticles(
  excludeId?: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
  page: number = 1,
  withCount: boolean = false,
): Promise<StrapiResponse<BlogArticleData>> {
  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .sort('desc')
    .addPaginationParams({
      page,
      pageSize,
      withCount,
    });
  const apiUrl = urlParams.getApiUrl();
  const res = await fetch(decodeURIComponent(apiUrl), {
    next: {
      revalidate: 60 * 5, // revalidate every 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const responseData = await res.json();
  const data = {
    meta: responseData.meta,
    data: responseData.data.filter(
      (el: BlogArticleData) => el.id !== excludeId,
    ),
  };

  return data;
}
