import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getArticleBySlug(slug: string) {
  const urlParams = new ArticleStrapiApi().filterBySlug(slug);
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

  const data = await res.json(); // Extract data from the response

  return { data };
}
