'use client';

import { useCallback, useEffect, useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import type { Hex } from 'viem';
import { isAddress } from 'viem';

import { DeFiReacherClaimABI } from '@/const/abi/deFiReacherABI';
import { useDeFiReacherRewardClaimCalldata } from '@/hooks/rewards/useDeFiReacherRewardClaimCalldata';
import { useDeFiReacherValidateHash } from '@/hooks/rewards/useDeFiReacherValidateHash';
import {
  generatePendingClaimedRewardKey,
  useRewardsStore,
} from '@/stores/rewards/RewardsStore';
import { useMenuStore } from '@/stores/menu/MenuStore';
import type { DeFiReacherReward } from '@/types/rewards';

import { BaseRewardClaim, type ClaimConfig } from './BaseRewardClaim';

interface DefiReacherRewardClaimProps {
  availableReward: DeFiReacherReward;
}

export const DefiReacherRewardClaim: FC<DefiReacherRewardClaimProps> = ({
  availableReward,
}) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);
  const setPendingClaimedReward = useRewardsStore(
    (state) => state.setPendingClaimedReward,
  );
  const removePendingClaimedReward = useRewardsStore(
    (state) => state.removePendingClaimedReward,
  );
  const { refetch: fetchClaimCalldata, isFetching } =
    useDeFiReacherRewardClaimCalldata(address, availableReward.campaignId);
  const { mutate: validateHash, isPending: isPendingValidation } =
    useDeFiReacherValidateHash();

  const pendingClaimedRewardKey = useMemo(
    () =>
      generatePendingClaimedRewardKey(
        availableReward.campaignId,
        address ?? '',
      ),
    [availableReward.campaignId, address],
  );
  const pendingTxHash = useRewardsStore((state) =>
    state.getPendingClaimedReward(pendingClaimedRewardKey),
  );

  const handleValidationError = useCallback(() => {
    setSnackbarState(true, t('profile_page.rewardsClaim.error'), 'error');
  }, [setSnackbarState, t]);

  const prepareClaim = useCallback(async (): Promise<ClaimConfig | null> => {
    const { data: claimCalldata } = await fetchClaimCalldata();

    if (
      !claimCalldata ||
      !isAddress(claimCalldata.args.account) ||
      !isAddress(claimCalldata.contractAddress)
    ) {
      return null;
    }

    return {
      chainId: claimCalldata.chainId,
      address: claimCalldata.contractAddress as `0x${string}`,
      abi: DeFiReacherClaimABI,
      functionName: 'claim',
      args: [
        BigInt(claimCalldata.args.index),
        claimCalldata.args.account,
        BigInt(claimCalldata.args.amount),
        claimCalldata.args.merkleProof,
      ],
    };
  }, [fetchClaimCalldata]);

  const postClaim = useCallback(
    async (txHash: Hex) => {
      setPendingClaimedReward(pendingClaimedRewardKey, txHash);
    },
    [pendingClaimedRewardKey, setPendingClaimedReward],
  );

  const runValidation = useCallback(
    (txHash: Hex) => {
      validateHash(txHash, {
        onSuccess: (result) => {
          if (result?.success) {
            removePendingClaimedReward(pendingClaimedRewardKey);
          } else {
            handleValidationError();
          }
        },
        onError: handleValidationError,
      });
    },
    [
      pendingClaimedRewardKey,
      removePendingClaimedReward,
      validateHash,
      handleValidationError,
    ],
  );

  useEffect(() => {
    if (pendingTxHash) {
      runValidation(pendingTxHash);
    }
  }, []);

  const afterConfirm = useCallback(
    (txHash: Hex) => {
      runValidation(txHash);
    },
    [runValidation],
  );

  return (
    <BaseRewardClaim
      availableReward={availableReward}
      prepareClaim={prepareClaim}
      postClaim={postClaim}
      afterConfirm={afterConfirm}
      isPreparingClaim={isFetching}
      pendingTxHash={pendingTxHash}
      isPendingValidation={isPendingValidation}
    />
  );
};
