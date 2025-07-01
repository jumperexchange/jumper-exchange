import { useInfiniteQuery } from '@tanstack/react-query';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { FIVE_MINUTES_MS, TEN_MINUTES_MS } from 'src/const/time';
import { QuestData, StrapiResponseData } from 'src/types/strapi';

export async function loadMoreMissions(page: number, pageSize: number = 12) {
  const { data: missionsResponse } = await getQuestsWithNoCampaignAttached({
    page,
    pageSize,
    withCount: true,
  });

  return {
    missions: missionsResponse.data,
    hasMore: missionsResponse.data.length === pageSize,
    nextPage: page + 1,
    currentPage: page,
  };
}

export const useMissionsInfinite = (
  initialData?: StrapiResponseData<QuestData>,
  pageSize: number = 12,
) => {
  return useInfiniteQuery({
    queryKey: ['missions', pageSize],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => loadMoreMissions(pageParam, pageSize),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialData: initialData
      ? {
          pages: [
            {
              missions: initialData,
              hasMore: initialData.length === pageSize,
              nextPage: 2,
              currentPage: 1,
            },
          ],
          pageParams: [1],
        }
      : undefined,
    staleTime: FIVE_MINUTES_MS,
    gcTime: TEN_MINUTES_MS,
  });
};
