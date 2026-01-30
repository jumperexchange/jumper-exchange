'use client';
import { DeFiReacherClaimABI } from '@/const/abi/deFiReacherABI';
import { useDeFiReacherRewardClaimCalldata } from '@/hooks/rewards/useDeFiReacherRewardClaimCalldata';
import type { DeFiReacherReward } from '@/types/rewards';
import type { FC } from 'react';
import { useAccount } from 'wagmi';
import { BaseRewardClaim, type ClaimConfig } from './BaseRewardClaim';
import type { Hex } from 'viem';
import { isAddress } from 'viem';
import { useDeFiReacherValidateHash } from '@/hooks/rewards/useDeFiReacherValidateHash';

interface DefiReacherRewardClaimProps {
  availableReward: DeFiReacherReward;
}

export const DefiReacherRewardClaim: FC<DefiReacherRewardClaimProps> = ({
  availableReward,
}) => {
  const { address } = useAccount();
  const { refetch: fetchClaimCalldata, isFetching } =
    useDeFiReacherRewardClaimCalldata(address, availableReward.campaignId);

  const { mutate: validateHash } = useDeFiReacherValidateHash();

  const prepareClaim = async (): Promise<ClaimConfig | null> => {
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
  };

  const postClaim = async (txHash: Hex) => {
    console.log('30. DefiReacherRewardClaim postClaim', txHash);
    await validateHash(txHash);
  };

  return (
    <BaseRewardClaim
      availableReward={availableReward}
      prepareClaim={prepareClaim}
      isPreparingClaim={isFetching}
      postClaim={postClaim}
    />
  );
};
