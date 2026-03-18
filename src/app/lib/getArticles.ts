import type { BlogArticleData, StrapiResponse } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

const DEFAULT_PAGE_SIZE = 20;

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
  const accessToken = getStrapiApiAccessToken();
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

  return data;
}
