import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { Quest } from 'src/types/loyaltyPass';
import type { StrapiResponse } from 'src/types/strapi';

export async function getQuestBy(key: string, value: string) {
  const urlParams = new QuestStrapiApi().filterBy(key, value);
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();

  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'no-store',
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
