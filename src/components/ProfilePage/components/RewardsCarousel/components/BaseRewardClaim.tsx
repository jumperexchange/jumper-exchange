'use client';
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { RewardClaimCard } from './RewardClaimCard';
import type { BaseReward } from '@/types/rewards';
import type { Abi } from 'viem';
import * as Sentry from '@sentry/nextjs';

export interface ClaimConfig {
  chainId: number;
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
}

interface BaseRewardClaimProps<T extends BaseReward> {
  availableReward: T;
  prepareClaim: () => Promise<ClaimConfig | null>;
  isPreparingClaim?: boolean;
}

export const BaseRewardClaim = <T extends BaseReward>({
  availableReward,
  prepareClaim,
  isPreparingClaim = false,
}: BaseRewardClaimProps<T>) => {
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  });

  const amount = availableReward.amountToClaim;
  const isLoading = isPending || isConfirming || isPreparingClaim;
  const isZeroAmount = !amount || amount === 0;
  const isButtonDisabled = isLoading || isZeroAmount;

  const handleClaimClick = async () => {
    try {
      const claimConfig = await prepareClaim();

      if (!claimConfig) {
        return;
      }

      const { id } = await switchChainAsync({
        chainId: claimConfig.chainId,
      });

      if (id !== claimConfig.chainId || !address || amount <= 0) {
        return;
      }

      writeContract({
        address: claimConfig.address,
        abi: claimConfig.abi,
        functionName: claimConfig.functionName,
        args: claimConfig.args,
      });
    } catch (err) {
      console.error('Error during claim:', err);
      Sentry.captureException(err);
    }
  };

  return (
    <RewardClaimCard
      availableReward={availableReward}
      onClaim={handleClaimClick}
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      isConfirmed={isConfirmed || isError}
      hash={hash}
    />
  );
};
