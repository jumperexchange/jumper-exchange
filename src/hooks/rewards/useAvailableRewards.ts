import { getUserRewards } from '@/app/lib/getUserRewards';
import { FIVE_MINUTES_MS, ONE_HOUR_MS } from '@/const/time';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { useTokens } from '@/hooks/useTokens';
import type {
  DeFiReacherReward,
  MerklReward,
  RewardItem,
} from '@/types/rewards';
import {
  createWalletToken,
  type PortfolioBalance,
  type WalletToken,
} from '@/types/tokens';
import { useQuery } from '@tanstack/react-query';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { isAddress } from 'viem';

export const CLAIMABLE_MIN_AMOUNT_USD = 0.1;

interface UseAvailableRewardsProps {
  userAddress?: string;
  jumperCampaignId?: string;
}

export const useAvailableRewards = ({
  userAddress,
  jumperCampaignId,
}: UseAvailableRewardsProps) => {
  const isValidAddress = !!userAddress && isAddress(userAddress);

  const {
    data: availableRewards,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['MerklUserRewards', userAddress, jumperCampaignId],
    queryFn: () => getUserRewards(userAddress!, jumperCampaignId),
    enabled: isValidAddress,
    refetchInterval: ONE_HOUR_MS,
    staleTime: FIVE_MINUTES_MS,
    gcTime: ONE_HOUR_MS,
    select: (res) =>
      (res?.rewards ?? []) as (MerklReward | DeFiReacherReward)[],
  });

  const { getToken } = useTokens();
  const { toRawAmount } = useTokenAmountInput();

  const rewards = useMemo(() => {
    const combined: RewardItem[] = (availableRewards ?? []).map((reward) =>
      reward.type === 'merkl'
        ? { type: 'merkl' as const, reward: reward as MerklReward }
        : {
            type: 'defi-reacher' as const,
            reward: reward as DeFiReacherReward,
          },
    );

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
              logoURI: item.reward.logoURI || token?.logoURI || '',
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
  }, [availableRewards, getToken, toRawAmount]);

  return { rewards, isLoading, isSuccess };
};
