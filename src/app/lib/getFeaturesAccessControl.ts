import type { FeaturesAccessControlData } from '@/types/featuresAccessControl';
import type { StrapiResponse } from '@/types/strapi';
import { FeaturesAccessControlStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from '@/utils/strapi/strapiHelper';

export async function getFeaturesAccessControl(): Promise<
  StrapiResponse<FeaturesAccessControlData>
> {
  const urlParams = new FeaturesAccessControlStrapiApi().getAll();

  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();

  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch features access control data');
  }

  const data: StrapiResponse<FeaturesAccessControlData> = await res.json();
  return data;
}
