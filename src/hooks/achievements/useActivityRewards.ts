import { compareDesc } from 'date-fns';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import type { PDA } from '@/types/loyaltyPass';

// The monthly on-chain activity reward categories emitted by jumper-backend
// (REWARD_TYPES in get-rewards-level.ts), in display order. This exact set of
// 4 also drives the Earn XP "ongoing activity" tiers (see useOngoingActivity)
// — do not add to it without also updating that tier data.
export const ACTIVITY_REWARD_TYPES = [
  'swap_oor',
  'earn_oor',
  'bridge_oor',
  'chain_oor',
] as const;

export type ActivityRewardType = (typeof ACTIVITY_REWARD_TYPES)[number];

interface UseActivityRewardsResult {
  activities: PDA[];
  isLoading: boolean;
}

// The wallet's settled on-chain activity achievements from the loyalty pass,
// newest first. The running month is excluded — it lives in the Earn XP
// section (see useOngoingActivity) until it settles. Past credentials (e.g.
// one-off mission/campaign rewards) are tracked separately (see
// useCompletedCredentials).
export const useActivityRewards = (
  walletAddress?: string,
): UseActivityRewardsResult => {
  const { pdas, isLoading } = useLoyaltyPass(walletAddress);

  const activities = (pdas ?? [])
    .filter(
      (pda) =>
        (ACTIVITY_REWARD_TYPES as readonly string[]).includes(
          pda?.reward?.type,
        ) && !pda.ongoing,
    )
    .sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return { activities, isLoading };
};
