import { PaginationProps, QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { QuestData, StrapiResponse } from 'src/types/strapi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getQuestsWithNoCampaignAttached(
  pagination: PaginationProps = {
    page: 1,
    pageSize: 25,
    withCount: false,
  },
) {
  const urlParams = new QuestStrapiApi()
    .filterByNoCampaignAttached()
    .filterByStartAndEndDate()
    .addPaginationParams({
      page: pagination.page,
      pageSize: pagination.pageSize,
      withCount: pagination.withCount,
    });
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

  const data: StrapiResponse<QuestData> = await res.json();

  return { data };
}
