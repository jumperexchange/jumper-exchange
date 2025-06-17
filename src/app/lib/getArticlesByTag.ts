import type { BlogArticleData } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getArticlesByTag(
  excludeId: number,
  tag: number | number[],
) {
  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .filterByTag(tag)
    .sort('desc');
  const apiBaseUrl = urlParams.getApiBaseUrl();
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

  const responseData = await res.json();
  const data = responseData.data.filter(
    // exclude current article id
    (el: BlogArticleData) => el.id !== excludeId,
  );

  return { data, url: apiBaseUrl }; // Return a plain object
}
