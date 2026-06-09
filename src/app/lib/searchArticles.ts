import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
export async function searchArticles(
  searchText: string,
): Promise<StrapiResponse<BlogArticleData>> {
  const trimmed = searchText.trim();
  if (!trimmed) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } },
    };
  }

  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .filterByTitleOrSubtitle(trimmed)
    .sort('desc');

  const apiUrl = urlParams.getApiUrl();
  const res = await fetch(apiUrl);

  if (!res.ok) {
    throw new Error('Failed to search articles');
  }

  const responseData = await res.json();
  return {
    meta: responseData.meta,
    data: responseData.data ?? [],
  };
}
