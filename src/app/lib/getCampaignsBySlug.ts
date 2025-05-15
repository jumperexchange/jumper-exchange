import { CampaignStrapiApi } from '@/utils/strapi/StrapiApi';
import type { GetCampaignsResponse } from './getCampaigns';

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
  const accessToken = urlParams.apiAccessToken;

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

  return { ...data, url: apiBaseUrl };
}
