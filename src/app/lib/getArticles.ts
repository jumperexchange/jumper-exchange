import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

export interface GetArticlesResponse extends StrapiResponse<BlogArticleData> {
  url: string; // Define the shape of the URL
}

export async function getArticles(
  excludeId?: number,
  pageSize?: number,
): Promise<GetArticlesResponse> {
  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .sort('desc')
    .addPaginationParams({
      page: 1,
      pageSize: pageSize || 20,
      withCount: false,
    });
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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

  return { ...data, url: apiBaseUrl }; // Return a plain object
}
