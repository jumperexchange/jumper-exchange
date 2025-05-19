import type { BlogArticleData } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getArticlesByTag(
  excludeId: number,
  tag: number | number[],
) {
  const urlParams = new ArticleStrapiApi().filterByTag(tag).sort('desc');
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

  const data = await res.json().then((output) =>
    // exclude current article id
    output.data.filter((el: BlogArticleData) => el.id !== excludeId),
  ); // Extract data from the response

  return { data, url: apiBaseUrl }; // Return a plain object
}
