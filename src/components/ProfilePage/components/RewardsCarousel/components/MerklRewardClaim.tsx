'use client';

import { MerklDistribABI } from '@/const/abi/merklABI';
import type { MerklReward } from '@/types/rewards';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { BaseRewardClaim, type ClaimConfig } from './BaseRewardClaim';

interface MerklRewardClaimProps {
  availableReward: MerklReward;
}

export const MerklRewardClaim: FC<MerklRewardClaimProps> = ({
  availableReward,
}) => {
  const { address } = useAccount();

  const prepareClaim = async (): Promise<ClaimConfig | null> => {
    if (!address || availableReward.proof.length === 0) {
      return null;
    }

    return {
      chainId: availableReward.chainId,
      address: availableReward.claimingAddress as `0x${string}`,
      abi: MerklDistribABI,
      functionName: 'claim',
      args: [
        [address],
        [availableReward.address],
        [availableReward.accumulatedAmountForContractBN],
        [availableReward.proof],
      ],
    };
  };

  return (
    <BaseRewardClaim
      availableReward={availableReward}
      prepareClaim={prepareClaim}
    />
  );
};
