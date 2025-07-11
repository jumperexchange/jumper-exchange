import type { BlogArticleData } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getArticlesByTag(
  excludeId: number,
  tag: number | number[],
) {
  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .filterByTag(tag)
    .sort('desc');
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
  const data = responseData.data.filter(
    // exclude current article id
    (el: BlogArticleData) => el.id !== excludeId,
  );

  return { data }; // Return a plain object
}
