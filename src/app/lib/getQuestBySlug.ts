import { QuestStrapiApi } from 'src/utils/strapi/StrapiApi';

export async function getQuestBySlug(slug: string) {
  const urlParams = new QuestStrapiApi().filterBySlug(slug);
  // const urlParams = createQuestStrapiApi().filterBySlug(slug);
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
