import type { RedeemableClaimData } from '@/hooks/earn/useRedeemableClaims';
import { useMemo } from 'react';

export const useFormatRedeemClaimData = (
  claimData: RedeemableClaimData | undefined,
) => {
  return useMemo(
    () =>
      claimData?.claimData?.map((claim) => {
        return {
          id: claim.id,
          status:
            claim.status === 'pending'
              ? 'pending'
              : claim.status === 'approved'
                ? 'success'
                : 'failed',
          timestamp: claim.timestamp,
          title:
            claim.status === 'pending'
              ? 'Pending request'
              : claim.status === 'approved'
                ? 'Accepted request'
                : 'Failed request',
          description:
            claim.status === 'pending'
              ? 'Waiting for request to be approved'
              : claim.status === 'approved'
                ? 'Click to complete your withdrawal'
                : 'Request failed',
          assetAmount: claim.assetAmount,
          lpTokenAmount: claim.lpTokenAmount,
        };
      }) ?? [],
    [claimData],
  );
};
