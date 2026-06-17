import { useDeFiReacherRewards } from '@/hooks/rewards/useDeFiReacherRewards';
import { useMerklRewards } from '@/hooks/rewards/useMerklRewards';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokens } from '@/hooks/useTokens';
import type { RewardItem } from '@/types/rewards';
import {
  createWalletToken,
  type PortfolioBalance,
  type WalletToken,
} from '@/types/tokens';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
import type { Address } from 'viem';

export const CLAIMABLE_MIN_AMOUNT_USD = 0.1;

export type RewardItemWithBalance = RewardItem & {
  balance: PortfolioBalance<WalletToken>;
};

interface UseAvailableRewardsProps {
  userAddress?: string;
}

export const useAvailableRewards = ({ userAddress }: UseAvailableRewardsProps) => {
  const {
    availableRewards: merklAvailableRewards,
    isSuccess: isMerklSuccess,
    isLoading: isMerklLoading,
  } = useMerklRewards({ userAddress });

  const {
    data: deFiReacherAvailableRewards = [],
    isSuccess: isDeFiReacherSuccess,
    isLoading: isDeFiReacherLoading,
  } = useDeFiReacherRewards({ userAddress });

  const { getToken } = useTokens();
  const { toRawAmount } = useTokenAmountInput();

  const rewards = useMemo((): RewardItemWithBalance[] => {
    const combined: RewardItem[] = [
      ...merklAvailableRewards.map((reward) => ({
        type: 'merkl' as const,
        reward,
      })),
      ...deFiReacherAvailableRewards.map((reward) => ({
        type: 'defi-reacher' as const,
        reward,
      })),
    ];

    return orderBy(
      combined
        .map((item) => {
          const token = getToken(
            item.reward.chainId,
            item.reward.address as Address,
          );
          const priceUSD = token?.priceUSD ?? '0';
          const amountStr = item.reward.amountToClaim.toFixed(
            item.reward.tokenDecimals,
          );
          const balance: PortfolioBalance<WalletToken> = {
            token: createWalletToken({
              address: item.reward.address,
              logoURI: item.reward.logoURI,
              name: item.reward.symbol,
              symbol: item.reward.symbol,
              decimals: item.reward.tokenDecimals,
              chainId: item.reward.chainId,
              chainKey: item.reward.chainId.toString(),
              priceUSD,
            }),
            amountUSD: item.reward.amountToClaim * Number(priceUSD),
            amount: toRawAmount(amountStr, item.reward.tokenDecimals),
          };
          return { ...item, balance };
        })
        .filter((item) => item.balance.amountUSD >= CLAIMABLE_MIN_AMOUNT_USD),
      (item) => item.balance.amountUSD,
      'desc',
    );
  }, [merklAvailableRewards, deFiReacherAvailableRewards, getToken, toRawAmount]);

  return {
    rewards,
    isLoading: isMerklLoading || isDeFiReacherLoading,
    isSuccess: isMerklSuccess || isDeFiReacherSuccess,
  };
};
