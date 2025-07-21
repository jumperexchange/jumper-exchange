import { PerksData, QuestData, StrapiResponseData } from 'src/types/strapi';
import { usePaginatedData } from '../usePaginatedData';
import { PAGE_SIZE } from 'src/const/quests';
import { getPerks } from 'src/app/lib/getPerks';

export async function fetchPerksData(page: number, pageSize: number = 12) {
  const { data: perksResponse } = await getPerks({
    page,
    pageSize,
    withCount: true,
  });

  return perksResponse.data;
}

export const usePerksInfinite = (
  initialData?: StrapiResponseData<PerksData>,
  pageSize: number = PAGE_SIZE,
) => {
  return usePaginatedData({
    queryKey: ['perks', pageSize],
    queryFn: fetchPerksData,
    initialData,
    pageSize,
  });
};
