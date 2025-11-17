import { useMemo } from 'react';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import type { ZapDataResponse } from 'src/providers/ZapInitProvider/ModularZaps/zap.jumper-backend';

export const useProjectLikeDataFromEarnOpportunity = (
  earnOpportunity: Pick<
    EarnOpportunityWithLatestAnalytics,
    'name' | 'asset' | 'protocol' | 'url' | 'lpToken' | 'latest'
  > & {
    minFromAmountUSD: number;
    positionUrl: string;
    address: string;
  },
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
        withdraw: {
          inputs: [
            {
              name: 'shares',
              type: 'uint256',
            },
            {
              name: 'receiver',
              type: 'address',
            },
            {
              name: 'owner',
              type: 'address',
            },
          ],
          name: 'redeem',
          outputs: [
            {
              name: 'assets',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'nonpayable',
          type: 'function',
        },
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
