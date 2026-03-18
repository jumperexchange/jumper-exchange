'use client';
import {
  useAccount,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { RewardClaimCard } from './RewardClaimCard';
import type { BaseReward } from '@/types/rewards';
import type { Abi, Hex } from 'viem';
import { captureException } from '@sentry/nextjs';
import { useMenuStore } from '@/stores/menu/MenuStore';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface ClaimConfig {
  chainId: number;
  address: Hex;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
}

interface BaseRewardClaimProps<T extends BaseReward> {
  availableReward: T;
  prepareClaim: () => Promise<ClaimConfig | null>;
  postClaim?: (txHash: Hex) => Promise<void>;
  afterConfirm?: (hash: Hex) => void;
  isPreparingClaim?: boolean;
  pendingTxHash?: Hex;
  isPendingValidation?: boolean;
}

export const BaseRewardClaim = <T extends BaseReward>({
  availableReward,
  prepareClaim,
  postClaim,
  afterConfirm,
  isPreparingClaim = false,
  pendingTxHash,
  isPendingValidation = false,
}: BaseRewardClaimProps<T>) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);
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
  const isAmountValid = amount && amount > 0;
  const isButtonDisabled = isLoading || !isAmountValid;

  const handleError = useCallback(() => {
    setSnackbarState(true, t('profile_page.rewardsClaim.error'), 'error');
  }, [setSnackbarState, t]);

  const handleClaimClick = useCallback(async () => {
    try {
      const claimConfig = await prepareClaim();

      if (!claimConfig) {
        return;
      }

      const { id } = await switchChainAsync({
        chainId: claimConfig.chainId,
      });

      if (id !== claimConfig.chainId || !address || !isAmountValid) {
        handleError();
        return;
      }

      writeContract({
        address: claimConfig.address,
        abi: claimConfig.abi,
        functionName: claimConfig.functionName,
        args: claimConfig.args,
      });
    } catch (err) {
      captureException(err);
      handleError();
    }
  }, [
    isAmountValid,
    address,
    prepareClaim,
    switchChainAsync,
    writeContract,
    handleError,
  ]);

  useEffect(() => {
    if (isError) {
      handleError();
    }
  }, [isError, handleError]);

  useEffect(() => {
    if (hash && postClaim) {
      postClaim(hash);
    }
  }, [hash, postClaim]);

  useEffect(() => {
    if (!hash || !isConfirmed || !afterConfirm) {
      return;
    }
    afterConfirm(hash);
  }, [hash, isConfirmed, afterConfirm]);

  const displayHash = hash ?? pendingTxHash;
  const hasPendingTx = !!pendingTxHash;

  return (
    <RewardClaimCard
      availableReward={availableReward}
      onClaim={handleClaimClick}
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      isConfirmed={isConfirmed}
      isError={isError}
      hash={displayHash}
      hasPendingTx={hasPendingTx}
      isPendingValidation={isPendingValidation}
    />
  );
};
