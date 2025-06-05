import {
  fetchMerklOpportunities,
  transformOpportunity,
} from '@/utils/merkl/merklApi';
import { MerklOpportunity } from 'src/types/merkl';

export interface GetMerklOpportunitiesResponse {
  data: MerklOpportunity[];
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

    // Transform opportunities based on the context
    const data = opportunities.map((opportunity) => {
      // If we have rewardsIds, find the matching rewardsId for this opportunity
      const matchingRewardsId = rewardsIds.find((id) => id === opportunity.id);
      return transformOpportunity(opportunity, matchingRewardsId);
    });

    return { data };
  } catch (error) {
    console.error('Error fetching Merkl opportunities:', error);
    throw new Error('Failed to fetch Merkl opportunities');
  }
}
