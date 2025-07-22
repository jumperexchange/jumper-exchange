import type { PerksData, StrapiResponse } from '@/types/strapi';
import { PaginationProps, PerkStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getPerks(
  pagination: PaginationProps = {
    page: 1,
    pageSize: 10,
    withCount: false,
  },
) {
  const urlParams = new PerkStrapiApi()
    .sortBy('UnlockLevel')
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
    throw new Error('Failed to fetch perks data');
  }

  const data: StrapiResponse<PerksData> = await res.json();

  return { data };
}
