import { useMemo } from 'react';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export const useProjectLikeDataFromEarnOpportunity = (
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  },
) => {
  return useMemo(() => {
    return {
      projectData: {
        chain: earnOpportunity.asset.chain.chainKey,
        chainId: earnOpportunity.asset.chain.chainId,
        address: earnOpportunity.address,
        project: earnOpportunity.protocol.name,
        integrator: `zap.${earnOpportunity.protocol.name}`,
        integratorLink: earnOpportunity.url ?? 'unset',
        integratorPositionLink: earnOpportunity.positionUrl,
        minFromAmountUSD: earnOpportunity.minFromAmountUSD,
      },
    };
  }, [earnOpportunity]);
};
