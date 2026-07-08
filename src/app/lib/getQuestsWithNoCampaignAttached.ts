import type { PaginationProps } from '@/utils/strapi/StrapiApi';
import { QuestStrapiApi } from '@/utils/strapi/StrapiApi';
import type { QuestData, StrapiResponse } from 'src/types/strapi';
import { fetchStrapi } from '@/app/lib/fetchStrapi';

export async function getQuestsWithNoCampaignAttached(
  pagination: PaginationProps = {
    page: 1,
    pageSize: 25,
    withCount: false,
  },
  daysAhead: number = 0,
) {
  const urlParams = new QuestStrapiApi()
    .filterByNoCampaignAttached()
    .filterByStartAndEndDateIncludingUpcoming(daysAhead)
    .filterByNotEnded()
    .addPaginationParams({
      page: pagination.page,
      pageSize: pagination.pageSize,
      withCount: pagination.withCount,
    });
  const apiUrl = urlParams.getApiUrl();

  const res = await fetchStrapi(
    decodeURIComponent(apiUrl),
    { next: { revalidate: 60 * 5 } },
    'quests',
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: StrapiResponse<QuestData> = await res.json();

  return { data };
}
