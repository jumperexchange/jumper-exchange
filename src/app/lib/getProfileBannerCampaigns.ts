import type { CampaignData, StrapiResponse } from '@/types/strapi';
import { CampaignStrapiApi } from '@/utils/strapi/StrapiApi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export interface GetProfileBannerCampaignsResponse
  extends StrapiResponse<CampaignData> {
  url: string;
}

export async function getProfileBannerCampaigns(): Promise<GetProfileBannerCampaignsResponse> {
  const urlParams = new CampaignStrapiApi()
    .useCampaignBannerParams()
    .filterByShowProfileBanner()
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
    throw new Error('Failed to fetch campaign data');
  }

  const data = await res.json();

  return { ...data };
}
