import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { QuestData, StrapiResponse } from 'src/types/strapi';

export async function getQuestsWithNoCampaignAttached() {
  const urlParams = new QuestStrapiApi()
    .filterByNoCampaignAttached()
    .filterByStartAndEndDate()
    .addPaginationParams({
      page: 1,
      pageSize: 25,
      withCount: false,
    });
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.apiAccessToken;

  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60 * 1, // revalidate every 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: StrapiResponse<QuestData> = await res.json();

  return { data };
}
