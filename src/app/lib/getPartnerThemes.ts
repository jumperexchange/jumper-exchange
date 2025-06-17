import type { PartnerThemesData, StrapiResponse } from '@/types/strapi';
import { PartnerThemeStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getPartnerThemes(): Promise<
  StrapiResponse<PartnerThemesData>
> {
  const urlParams = new PartnerThemeStrapiApi();
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
