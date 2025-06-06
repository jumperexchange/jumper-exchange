import {
  fetchMerklOpportunities,
  MERKL_API,
  transformMerklOpportunities,
} from '@/utils/merkl/merklApi';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';

export interface GetMerklOpportunitiesResponse {
  data: CTALinkInt[];
  url: string;
}

export async function getMerklOpportunities({
  rewardsIds = [],
  campaignId,
}: {
  rewardsIds?: string[];
  campaignId?: string;
}): Promise<GetMerklOpportunitiesResponse> {
  try {
    const opportunities = await fetchMerklOpportunities({
      rewardsIds,
      campaignId,
    });

    const data = transformMerklOpportunities(
      opportunities,
      rewardsIds,
      campaignId,
    );

    return { data, url: MERKL_API };
  } catch (error) {
    console.error('Error fetching Merkl opportunities:', error);
    throw new Error('Failed to fetch Merkl opportunities');
  }
}
