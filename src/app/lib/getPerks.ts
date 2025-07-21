import type { PerksData, StrapiResponse } from '@/types/strapi';
import { PerkStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export interface GetProfileBannerCampaignsResponse
  extends StrapiResponse<PerksData> {
  url: string;
}

export async function getPerks(): Promise<GetProfileBannerCampaignsResponse> {
  const urlParams = new PerkStrapiApi()
    .sortBy('UnlockLevel')
    .addPaginationParams({
      page: 1,
      pageSize: 10,
      withCount: false,
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

  const data = await res.json();

  return { ...data };
}
