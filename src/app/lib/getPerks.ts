import type { PerksDataAttributes, StrapiResponse } from '@/types/strapi';
import type { PaginationProps } from '@/utils/strapi/StrapiApi';
import { PerkStrapiApi } from '@/utils/strapi/StrapiApi';
export async function getPerks(
  pagination: PaginationProps = {
    page: 1,
    pageSize: 10,
    withCount: false,
  },
) {
  const urlParams = new PerkStrapiApi()
    .sortByMultiple([
      { field: 'Featured', order: 'desc' },
      { field: 'UnlockLevel', order: 'asc' },
      { field: 'publishedAt', order: 'desc' },
      { field: 'createdAt', order: 'desc' },
    ])
    .addPaginationParams({
      page: pagination.page,
      pageSize: pagination.pageSize,
      withCount: pagination.withCount,
    });

  const apiUrl = urlParams.getApiUrl();

  const res = await fetch(decodeURIComponent(apiUrl), {
    next: {
      revalidate: 60 * 5, // revalidate every 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch perks data');
  }

  const data: StrapiResponse<PerksDataAttributes> = await res.json();

  return { data };
}

/**
 * Fetch every perk: read the total count, then request them all in one follow-up
 * call. Used wherever a complete perk list is required (profile page, perks hub,
 * navbar) so unlocked-perk counts never silently cap as more perks are added.
 */
export async function getAllPerks(): Promise<PerksDataAttributes[]> {
  const { data: countResponse } = await getPerks({
    page: 1,
    pageSize: 1,
    withCount: true,
  });
  const total = countResponse.meta.pagination.total;

  const { data: perksResponse } = await getPerks({
    page: 1,
    pageSize: Math.max(total, 1),
  });

  return perksResponse.data;
}
