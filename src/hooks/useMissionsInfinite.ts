import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { QuestData, StrapiResponseData } from 'src/types/strapi';
import { usePaginatedData } from './usePaginatedData';
import { PAGE_SIZE, UPCOMING_DAYS_AHEAD } from 'src/const/quests';

export async function fetchMissionsData(page: number, pageSize: number = 12) {
  const { data: missionsResponse } = await getQuestsWithNoCampaignAttached(
    {
      page,
      pageSize,
      withCount: true,
    },
    UPCOMING_DAYS_AHEAD,
  );

  return missionsResponse.data;
}

export const useMissionsInfinite = (
  initialData?: StrapiResponseData<QuestData>,
  pageSize: number = PAGE_SIZE,
) => {
  return usePaginatedData({
    queryKey: ['missions', pageSize],
    queryFn: fetchMissionsData,
    initialData,
    pageSize,
  });
};
