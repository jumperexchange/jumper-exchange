import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { QuestData, StrapiResponse } from 'src/types/strapi';

export async function getQuestsWithNoCampaignAttached() {
  const urlParams = new QuestStrapiApi().filterByNoCampaignAttached();
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

  const data: StrapiResponse<QuestData> = await res.json();

  return { data };
}
