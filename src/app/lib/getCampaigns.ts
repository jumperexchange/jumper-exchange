import type { CampaignData, StrapiResponse } from '@/types/strapi';
import { CampaignStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getCampaigns(): Promise<StrapiResponse<CampaignData>> {
  const urlParams = new CampaignStrapiApi().useCampaignPageParams();
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

  return data;
}
