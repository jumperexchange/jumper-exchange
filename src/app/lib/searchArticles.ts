import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

const DEFAULT_SEARCH_PAGE_SIZE = 10;

export async function searchArticles(
  searchText: string,
  pageSize: number = DEFAULT_SEARCH_PAGE_SIZE,
  page: number = 1,
  withCount: boolean = false,
): Promise<StrapiResponse<BlogArticleData>> {
  const trimmed = searchText.trim();
  if (!trimmed) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } },
    };
  }

  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .filterByTitleOrSubtitle(trimmed)
    .sort('desc')
    .addPaginationParams({
      page,
      pageSize,
      withCount,
    });
  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to search articles');
  }

  const responseData = await res.json();
  return {
    meta: responseData.meta,
    data: responseData.data ?? [],
  };
}
