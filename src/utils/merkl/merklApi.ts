import {
  AprRecord,
  Chain,
  MerklOpportunity,
  Protocol,
  RewardsRecord,
  Token,
  TvlRecord,
} from 'src/types/merkl';

export const MERKL_API = 'https://api.merkl.xyz/v4';
export const CACHE_TIME = 1000 * 60 * 60; // 1 hour
export const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export interface FetchMerklOpportunitiesProps {
  rewardsIds?: string[];
  campaignId?: string;
}

export async function fetchMerklOpportunities({
  rewardsIds = [],
  campaignId,
}: FetchMerklOpportunitiesProps): Promise<MerklOpportunity[]> {
  try {
    if (campaignId) {
      const response = await fetch(
        `${MERKL_API}/opportunities?campaignId=${campaignId}`,
        {
          next: {
            revalidate: 3600, // Revalidate every hour
            tags: ['merkl-opportunities', `merkl-opportunities-${campaignId}`],
          },
        },
      );
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      const result = await response.json();
      return Array.isArray(result) ? result : [result];
    }

    // If rewardsIds is provided, search for opportunities by rewardsId
    const opportunities = await Promise.all(
      rewardsIds.map(async (rewardsId) => {
        if (!rewardsId) return null;
        const response = await fetch(
          `${MERKL_API}/opportunities?&search=${rewardsId}`,
          {
            next: {
              revalidate: 3600,
              tags: ['merkl-opportunities', `merkl-opportunities-${rewardsId}`],
            },
          },
        );
        if (!response.ok) {
          throw new Error(`Merkl API error: ${response.status}`);
        }
        const result = await response.json();
        return result as MerklOpportunity[];
      }),
    );
    return opportunities.flat().filter(Boolean) as MerklOpportunity[];
  } catch (err) {
    console.error('Error fetching Merkl opportunities:', err);
    return [];
  }
}

export interface TransformedMerklOpportunity {
  // Core properties
  chainId: number;
  type: string;
  identifier: string;
  name: string;
  description: string;
  howToSteps: string[];
  status: string;
  action: string;

  // Financial metrics
  tvl: number;
  apr: number;
  apy: number;
  dailyRewards: number;

  // Identifiers and links
  id: string;
  claimingId: string;
  depositUrl: string;
  explorerAddress: string;
  lastCampaignCreatedAt: string;

  // UI related
  logo: string;
  text: string;
  link: string;
  tags: string[];

  // Nested objects
  tokens: Token[];
  chain: Chain;
  protocol: Protocol;
  aprRecord: AprRecord;
  tvlRecord: TvlRecord;
  rewardsRecord: RewardsRecord;
}

// Export the transformed opportunity type
export interface TransformedMerklOpportunity extends MerklOpportunity {
  // UI related properties that are added during transformation
  logo: string;
  text: string;
  link: string;
  claimingId: string;
  apy: number;
}

// Export the transformation function
export const transformOpportunity = (
  opportunity: MerklOpportunity,
  rewardsId?: string,
): TransformedMerklOpportunity => {
  return {
    ...opportunity,
    // Add UI-related properties
    logo: opportunity.protocol.icon,
    text: opportunity.name,
    link: opportunity.depositUrl,
    claimingId: rewardsId || opportunity.id,
    apy: opportunity.apr, // Note: apy is same as apr
  };
};
