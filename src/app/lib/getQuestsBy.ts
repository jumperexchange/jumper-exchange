import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { Quest } from 'src/types/loyaltyPass';
import type { StrapiResponse } from 'src/types/strapi';

// The getQuestsBy function fetches a list of quests from the Strapi API based on the provided key and value.
// It uses environment variables for API URLs and tokens to ensure secure and environment-specific configurations.
export async function getQuestsBy(key: string, value: string) {
  const urlParams = new QuestStrapiApi().filterBy(key, value);
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

  const data: StrapiResponse<Quest> = await res.json(); // Use the defined type here

  return { data, url: apiBaseUrl }; // Return a plain object
}
