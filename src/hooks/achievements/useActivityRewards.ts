import { compareDesc } from 'date-fns';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import type { PDA } from 'src/types/loyaltyPass';

// The monthly on-chain activity rewards emitted by jumper-backend
// (REWARD_TYPES in get-rewards-level.ts).
const ACTIVITY_REWARD_TYPES = [
  'earn_oor',
  'swap_oor',
  'chain_oor',
  'bridge_oor',
];

interface UseActivityRewardsResult {
  activities: PDA[];
  isLoading: boolean;
}

// The wallet's on-chain activity achievements from the loyalty pass, newest
// first. Mission completions are tracked separately via task verifications
// (see useCompletedMissions).
export const useActivityRewards = (
  walletAddress?: string,
): UseActivityRewardsResult => {
  const { pdas, isLoading } = useLoyaltyPass(walletAddress);

  const activities = (pdas ?? [])
    .filter((pda) => ACTIVITY_REWARD_TYPES.includes(pda?.reward?.type))
    .sort((a, b) => compareDesc(a.timestamp, b.timestamp));

  return { activities, isLoading };
};
