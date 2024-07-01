import type { PartnerThemesItems, StrapiResponse } from '@/types/strapi';
import { PartnerThemeStrapiApi } from '@/utils/strapi/StrapiApi';

export interface GetPartnerThemesResponse
  extends StrapiResponse<PartnerThemesItems> {
  url: string;
}

export async function getPartnerThemes(
  uid: string,
): Promise<GetPartnerThemesResponse> {
  const urlParams = new PartnerThemeStrapiApi().filterUid(uid);
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'force-cache',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

  console.log('RESPONSE', data);

  return { ...data, url: apiBaseUrl };
}
