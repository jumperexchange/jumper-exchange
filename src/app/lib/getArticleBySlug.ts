import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getArticleBySlug(slug: string, isDraftMode?: boolean) {
  let urlParams = new ArticleStrapiApi().filterBySlug(slug);
  if (isDraftMode) {
    urlParams = urlParams.forceDraftMode();
  }
  const apiUrl = urlParams.getApiUrl();
  const res = await fetch(decodeURIComponent(apiUrl), {
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
