'use client';
import { useQuery } from '@tanstack/react-query';
import type { CTALinkInt } from 'src/components/Superfest/SuperfestPage/CTA/MissionCTA';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';

const MERKL_API = 'https://api.merkl.xyz/v4/opportunities';

interface Token {
  id: string;
  name: string;
  chainId: number;
  address: string;
  decimals: number;
  icon: string;
  verified: boolean;
  isTest: boolean;
  isPoint: boolean;
  isPreTGE: boolean;
  isNative: boolean;
  price: number;
  symbol: string;
  displaySymbol?: string;
}

interface Chain {
  id: number;
  name: string;
  icon: string;
  Explorer: Array<{
    id: string;
    type: string;
    url: string;
    chainId: number;
  }>;
}

interface Protocol {
  id: string;
  tags: string[];
  name: string;
  description: string;
  url: string;
  icon: string;
}

interface Breakdown {
  distributionType: string;
  identifier: string;
  type: string;
  value: number;
}

interface AprRecord {
  cumulated: number;
  timestamp: string;
  breakdowns: Breakdown[];
}

interface TvlRecord {
  id: string;
  total: number;
  timestamp: string;
  breakdowns: Array<{
    identifier: string;
    type: string;
    value: number;
  }>;
}

interface RewardToken extends Token {
  displaySymbol: string;
}

interface RewardBreakdown {
  token: RewardToken;
  amount: string;
  value: number;
  distributionType: string;
  id: string;
  campaignId: string;
  dailyRewardsRecordId: string;
}

interface RewardsRecord {
  id: string;
  total: number;
  timestamp: string;
  breakdowns: RewardBreakdown[];
}

interface MerklOpportunity {
  chainId: number;
  type: string;
  identifier: string;
  name: string;
  description: string;
  howToSteps: string[];
  status: string;
  action: string;
  tvl: number;
  apr: number;
  dailyRewards: number;
  tags: string[];
  id: string;
  depositUrl: string;
  explorerAddress: string;
  lastCampaignCreatedAt: string;
  tokens: Token[];
  chain: Chain;
  protocol: Protocol;
  aprRecord: AprRecord;
  tvlRecord: TvlRecord;
  rewardsRecord: RewardsRecord;
}

interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  CTAsWithAPYs: CTALinkInt[];
}

export const useMissionsAPY = (
  rewardsIds: string[] = [],
): useMissionsAPYRes => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['merklOpportunities', rewardsIds.map((rewardsId) => rewardsIds)],
    queryFn: async () => {
      try {
        const opportunities = await Promise.all(
          rewardsIds.map(async (rewardsId) => {
            if (!rewardsId) return null;
            const response = await fetch(
              `${MERKL_API}?chainId=${REWARDS_CHAIN_IDS[0]}&search=${rewardsId}`,
            );
            const result = await response.json();
            return result as MerklOpportunity[];
          }),
        );
        return opportunities.flat().filter(Boolean) as MerklOpportunity[];
      } catch (err) {
        console.error('Error fetching Merkl opportunities:', err);
        return [];
      }
    },
    enabled: rewardsIds.length > 0,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  const CTAsWithAPYs = rewardsIds.map((rewardsId: string) => {
    if (!rewardsId || !data) return { claimingId: rewardsId } as CTALinkInt;

    const opportunity = data.find((opp) =>
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
      } as CTALinkInt;
    }

    return { claimingId: rewardsId } as CTALinkInt;
  });

  return {
    CTAsWithAPYs,
    isLoading,
    isSuccess,
  };
};
