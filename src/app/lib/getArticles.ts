import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getArticles(
  excludeId?: number,
  pageSize?: number,
): Promise<StrapiResponse<BlogArticleData>> {
  const urlParams = new ArticleStrapiApi().sort('desc').addPaginationParams({
    page: 1,
    pageSize: pageSize || 20,
    withCount: false,
  });
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.apiAccessToken;
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

  const data = await res.json().then((output) =>
    // filter out given excludeId
    {
      return {
        meta: output.meta,
        data: output.data.filter((el: BlogArticleData) => el.id !== excludeId),
      };
    },
  ); // Extract data from the response

  return data;
}
