import { useQuery } from '@tanstack/react-query';
import { ONE_HOUR_MS } from 'src/const/time';
import { makeClient } from '@/app/lib/client';
import {
  ACTIVITY_REWARD_TYPES,
  type ActivityRewardType,
} from './useActivityRewards';

// Raw item from GET /wallets/:address/ongoing-rewards (RewardType in
// jumper-backend), computed live from the running month's transactions.
// `image` comes from the current month's reward entity and may be missing
// early in the month.
export interface OngoingReward {
  type: string;
  // Volume in USD (chains visited for chain_oor) accumulated this month.
  currentValue: number;
  // Inclusive bounds of the current tier.
  min: number;
  max: number;
  // XP awarded by the current tier and the next one (0 = top tier reached).
  currentRangeXP: number;
  nextRangeXP: number;
  image?: string;
}

export interface OngoingActivity extends OngoingReward {
  type: ActivityRewardType;
  // 0..1 fill of the tier progress ring.
  progress: number;
  // Volume (or chains) still needed to reach the next tier.
  amountToNextTier: number;
  // XP awarded when the next tier is reached.
  nextTierXP: number;
  // XP shown on the card badge: the secured tier XP, or the first reachable
  // tier's XP when nothing is secured yet.
  availableXP: number;
  // No XP secured this month yet — the category's goal is still open.
  isOutstanding: boolean;
  isTopTier: boolean;
}

// First-tier data per category, mirroring get-rewards-level.ts in
// jumper-backend. The endpoint returns no items for wallets without
// transactions this month, so missing categories fall back to these.
const ZERO_STATE: Record<ActivityRewardType, OngoingReward> = {
  swap_oor: {
    type: 'swap_oor',
    currentValue: 0,
    min: 100,
    max: 999,
    currentRangeXP: 10,
    nextRangeXP: 18,
  },
  earn_oor: {
    type: 'earn_oor',
    currentValue: 0,
    min: 0,
    max: 99,
    currentRangeXP: 0,
    nextRangeXP: 5,
  },
  bridge_oor: {
    type: 'bridge_oor',
    currentValue: 0,
    min: 100,
    max: 999,
    currentRangeXP: 10,
    nextRangeXP: 18,
  },
  chain_oor: {
    type: 'chain_oor',
    currentValue: 0,
    min: 1,
    max: 1,
    currentRangeXP: 5,
    nextRangeXP: 10,
  },
};

// Always yields all four categories in display order. Below the first tier
// threshold the backend reports the first tier's ranges together with the
// actual (too low) currentValue, so that case is detected via
// currentValue < min and progresses toward `min` instead of `max`.
export const deriveOngoingActivity = (
  rewards: OngoingReward[],
): OngoingActivity[] =>
  ACTIVITY_REWARD_TYPES.map((type) => {
    const reward =
      rewards.find((item) => item.type === type) ?? ZERO_STATE[type];
    const isTopTier = reward.nextRangeXP === 0;
    const isBelowFirstTier = reward.currentValue < reward.min;
    const isOutstanding = isBelowFirstTier || reward.currentRangeXP === 0;

    const tierStart = isBelowFirstTier ? 0 : reward.min;
    // The bounds are inclusive, so the next tier starts at max + 1.
    const tierEnd = isBelowFirstTier ? reward.min : reward.max + 1;
    const amountToNextTier = Math.max(0, tierEnd - reward.currentValue);
    const progress = isTopTier
      ? 1
      : Math.min(
          1,
          Math.max(
            0,
            (reward.currentValue - tierStart) / (tierEnd - tierStart),
          ),
        );
    const nextTierXP = isBelowFirstTier
      ? reward.currentRangeXP
      : reward.nextRangeXP;

    return {
      ...reward,
      type,
      progress,
      amountToNextTier,
      nextTierXP,
      availableXP: reward.currentRangeXP || reward.nextRangeXP,
      isOutstanding,
      isTopTier,
    };
  });

// XP secured this month across all categories. Outstanding categories
// contribute nothing — their currentRangeXP is the backend's first-tier
// fallback, not earned XP.
export const sumEarnedXP = (activities: OngoingActivity[]): number =>
  activities.reduce(
    (sum, activity) =>
      sum + (activity.isOutstanding ? 0 : activity.currentRangeXP),
    0,
  );

// The running month's activity progress per category. Settled months live in
// the "Your achievements" section (see useActivityRewards).
export const useOngoingActivity = (walletAddress?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['ongoing-activity', walletAddress],
    queryFn: async (): Promise<OngoingReward[]> => {
      const client = makeClient();
      const res =
        await client.v1.walletControllerFindWalletOngoingRewardsByAddressV1(
          walletAddress!,
        );
      return res.data.data ?? [];
    },
    enabled: !!walletAddress,
    refetchInterval: ONE_HOUR_MS,
  });

  const activities = deriveOngoingActivity(data ?? []);

  return {
    activities,
    outstandingCount: activities.filter((activity) => activity.isOutstanding)
      .length,
    earnedXP: sumEarnedXP(activities),
    isLoading,
  };
};
