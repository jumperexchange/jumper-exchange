import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { MerklOpportunity } from 'src/types/merkl';

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

export function transformMerklOpportunities(
  opportunities: MerklOpportunity[],
  rewardsIds: string[],
  campaignId?: string,
): CTALinkInt[] {
  if (rewardsIds.length > 0) {
    return rewardsIds
      .map((rewardsId: string) => {
        const opportunity = opportunities.find((opp) =>
          opp.aprRecord?.breakdowns?.some(
            (breakdown) => breakdown.identifier === rewardsId,
          ),
        );
        if (opportunity) {
          return {
            claimingId: rewardsId,
            apy: opportunity.apr,
            logo: opportunity.protocol.icon,
            text: opportunity.name,
            link: opportunity.depositUrl,
          };
        }
      })
      .filter((el) => !!el);
  }

  if (campaignId && opportunities.length === 1) {
    return [
      {
        claimingId: opportunities[0].id,
        apy: opportunities[0].apr,
        logo: opportunities[0].protocol.icon,
        text: opportunities[0].name,
        link: opportunities[0].depositUrl,
      },
    ];
  }

  return [];
}
