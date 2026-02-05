import { useMemo } from 'react';
import type { ZapDataResponse } from '@/types/zaps';
import type { EarnOpportunityExtended } from 'src/stores/depositFlow/DepositFlowStore';

export const useProjectLikeDataFromEarnOpportunity = (
  earnOpportunity: EarnOpportunityExtended,
) => {
  return useMemo(() => {
    // Construct ZapDataResponse from earnOpportunity data
    const zapData: ZapDataResponse = {
      market: {
        name: earnOpportunity.name,
        address: earnOpportunity.lpToken.address as `0x${string}`,
        depositToken: {
          address: earnOpportunity.asset.address as `0x${string}`,
          symbol: earnOpportunity.asset.symbol,
          name: earnOpportunity.asset.name,
          decimals: earnOpportunity.asset.decimals,
          chainId: earnOpportunity.asset.chain.chainId,
          coinKey: earnOpportunity.asset.symbol.toLowerCase(),
          logoURI: earnOpportunity.asset.logo,
        },
        lpToken: {
          symbol: earnOpportunity.lpToken.symbol,
          decimals: earnOpportunity.lpToken.decimals,
          name: earnOpportunity.lpToken.name,
        },
      },
      meta: {
        name: earnOpportunity.protocol.name,
        logoURI: earnOpportunity.protocol.logo || '',
      },
      analytics: {
        base_apy: earnOpportunity.latest?.apy?.base || 0,
        boosted_apy: earnOpportunity.latest?.apy?.reward || 0,
        total_apy: earnOpportunity.latest?.apy?.total || 0,
        tvl_usd: parseFloat(earnOpportunity.latest?.tvlUsd || '0'),
      },
      abi: {
        approve: {} as any, // Not needed for DepositModal
        deposit: {} as any, // Not needed for DepositModal
        transfer: {} as any, // Not needed for DepositModal
      },
    };

    return {
      projectData: {
        chain: earnOpportunity.asset.chain.chainKey,
        chainId: earnOpportunity.asset.chain.chainId,
        address: earnOpportunity.lpToken.address,
        project: earnOpportunity.protocol.name,
        integrator: `zap.${earnOpportunity.protocol.name}`,
        integratorLink: earnOpportunity.url ?? 'unset',
        integratorPositionLink: earnOpportunity.positionUrl,
        minFromAmountUSD: earnOpportunity.minFromAmountUSD,
      },
      zapData,
    };
  }, [earnOpportunity]);
};
