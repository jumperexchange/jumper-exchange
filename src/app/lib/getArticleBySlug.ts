import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

// The getArticleBySlug function fetches an article from the Strapi API based on the provided slug.
// It uses environment variables for API URLs and tokens to ensure secure and environment-specific configurations.
export async function getArticleBySlug(slug: string) {
  const urlParams = new ArticleStrapiApi().filterBySlug(slug);
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'force-cache',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json(); // Extract data from the response

  return { data, url: apiBaseUrl }; // Return a plain object
}
