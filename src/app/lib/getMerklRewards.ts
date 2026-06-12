import type { MerklRewardsData, StrapiResponse } from '@/types/strapi';
import { MerklRewardsStrapiApi } from '@/utils/strapi/StrapiApi';

export async function getMerklRewards() {
  const urlParams = new MerklRewardsStrapiApi();
  const apiUrl = urlParams.getApiUrl();
  const res = await fetch(decodeURIComponent(apiUrl), {
    next: {
      revalidate: 60 * 5, // revalidate every 5 minutes
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data: StrapiResponse<MerklRewardsData> = await res.json();

  return { data };
}
