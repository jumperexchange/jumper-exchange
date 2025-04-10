import type { CampaignData, StrapiResponse } from '@/types/strapi';
import { CampaignStrapiApi } from '@/utils/strapi/StrapiApi';

export interface GetCampaignsResponse extends StrapiResponse<CampaignData> {
  url: string;
}

export async function getCampaignBySlug(
  slug: string,
): Promise<GetCampaignsResponse> {
  const urlParams = new CampaignStrapiApi()
    .useCampaignPageParams()
    .filterBySlug(slug)
    .addPaginationParams({
      page: 1,
      pageSize: 1,
      withCount: false,
    });

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
    throw new Error('Failed to fetch campaign data');
  }

  const data = await res.json();

  return { ...data, url: apiBaseUrl };
}
