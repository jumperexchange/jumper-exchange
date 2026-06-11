'use client';

import { MerklDistribABI } from '@/const/abi/merklABI';
import type { MerklReward } from '@/types/rewards';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { BaseRewardClaim, type ClaimConfig } from './BaseRewardClaim';

interface MerklRewardClaimProps {
  availableReward: MerklReward;
  balance: PortfolioBalance<WalletToken>;
}

export const MerklRewardClaim: FC<MerklRewardClaimProps> = ({
  availableReward,
  balance,
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
      balance={balance}
      prepareClaim={prepareClaim}
    />
  );
};
