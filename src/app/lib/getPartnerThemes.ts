import type { PartnerThemesData, StrapiResponse } from '@/types/strapi';
import { PartnerThemeStrapiApi } from '@/utils/strapi/StrapiApi';
import { fetchStrapi } from '@/app/lib/fetchStrapi';
import { cacheLife, cacheTag } from 'next/cache';

export async function getPartnerThemes(): Promise<
  StrapiResponse<PartnerThemesData>
> {
  'use cache';
  cacheTag('partner-themes');
  cacheLife({ revalidate: 300 });
  const urlParams = new PartnerThemeStrapiApi();
  const apiUrl = urlParams.getApiUrl();

  const res = await fetchStrapi(
    decodeURIComponent(apiUrl),
    {},
    'partner-themes',
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json().then((output) => {
    return {
      meta: output.meta,
      data: output.data,
    };
  });

  return { ...data };
}
