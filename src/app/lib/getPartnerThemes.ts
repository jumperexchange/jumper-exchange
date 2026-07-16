import type { PartnerThemesData, StrapiResponse } from '@/types/strapi';
import { PartnerThemeStrapiApi } from '@/utils/strapi/StrapiApi';
import { fetchStrapi } from '@/app/lib/fetchStrapi';

export async function getPartnerThemes(): Promise<
  StrapiResponse<PartnerThemesData>
> {
  const urlParams = new PartnerThemeStrapiApi();
  const apiUrl = urlParams.getApiUrl();

  const res = await fetchStrapi(
    decodeURIComponent(apiUrl),
    { next: { revalidate: 60 * 5, tags: ['partner-themes'] } },
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
