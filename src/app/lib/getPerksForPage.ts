import type { PaginationProps } from '@/utils/strapi/StrapiApi';
import { cacheLife } from 'next/cache';
import { getPerks } from '@/app/lib/getPerks';

export async function getPerksForPage(
  pagination: PaginationProps = {
    page: 1,
    pageSize: 10,
    withCount: false,
  },
) {
  'use cache';
  cacheLife({ revalidate: 300 });
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
