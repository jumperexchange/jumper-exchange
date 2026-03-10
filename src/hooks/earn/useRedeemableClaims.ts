import { useQuery } from '@tanstack/react-query';
import { useAccountAddress } from './useAccountAddress';
import type { Hex } from 'viem';
import { makeClient } from '@/app/lib/client';
import type { EarnOpportunityExtended } from '@/stores/depositFlow/DepositFlowStore';

interface ClaimDataEntry {
  id?: string;
  assetAmount?: string;
  lpTokenAmount?: string;
  timestamp?: string;
  status?: string;
}

export interface RedeemableClaimData {
  claimData: ClaimDataEntry[];
}

export const useRedeemableClaims = (
  earnOpportunity: EarnOpportunityExtended,
  hasDeposited: boolean,
) => {
  const address: Hex | undefined = useAccountAddress();
  return useQuery<RedeemableClaimData>({
    queryKey: ['redeemable-claims', address, earnOpportunity.slug],
    queryFn: async () => {
      const client = makeClient();
      // Need to make sure that this refresh only every (1 day via the cache header)
      const result = await client.v1.earnControllerGetVaultSpecificDataV1(
        earnOpportunity.slug,
        {
          address: address!,
        },
      );
      if (!result.ok) {
        throw result.error;
      }
      // @ts-expect-error see LF-15589 - we are transforming data in the backend
      const data = result.data.data ?? {};

      return {
        ...data,
        claimData: data.claimData
          ? Array.isArray(data.claimData)
            ? data.claimData
            : [data.claimData]
          : [],
      };
    },
    enabled:
      !!address &&
      !!earnOpportunity.slug &&
      hasDeposited &&
      !earnOpportunity.isRedeemable,
  });
};
