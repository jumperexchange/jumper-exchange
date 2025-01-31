import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { Quest } from 'src/types/loyaltyPass';
import type { ExtendedQuest } from 'src/types/questDetails';

// The getExtQuestBySlug function fetches a quest or extended quest from the Strapi API based on the provided slug.
// It uses environment variables for API URLs and tokens to ensure secure and environment-specific configurations.
export async function getExtQuestBySlug(
  slug: string,
  type?: 'Quest' | 'ExtendedQuest',
): Promise<{ data?: Quest | ExtendedQuest; url: string }> {
  const urlParams = new QuestStrapiApi().filterBySlug(slug);
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

  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return { data: undefined, url: apiBaseUrl };
  }
  if (type === 'ExtendedQuest') {
    return { data: data.data[0] as ExtendedQuest, url: apiBaseUrl };
  } else {
    return { data: data.data[0] as Quest, url: apiBaseUrl };
  }
}
