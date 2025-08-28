import { PerksDataAttributes, StrapiResponseData } from 'src/types/strapi';
import { usePaginatedData } from '../usePaginatedData';
import { getPerks } from 'src/app/lib/getPerks';
import { PAGE_SIZE } from 'src/const/perks';

export async function fetchPerksData(page: number, pageSize: number = 12) {
  const { data: perksResponse } = await getPerks({
    page,
    pageSize,
    withCount: true,
  });

  return perksResponse.data;
}

export const usePerksInfinite = (
  initialData?: StrapiResponseData<PerksDataAttributes>,
  pageSize: number = PAGE_SIZE,
) => {
  return usePaginatedData({
    queryKey: ['perks', pageSize],
    queryFn: fetchPerksData,
    initialData,
    pageSize,
  });
};
