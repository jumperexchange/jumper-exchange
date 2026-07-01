import { compareDesc } from 'date-fns';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import type { PDA } from '@/types/loyaltyPass';
import { ACTIVITY_REWARD_TYPES } from './useActivityRewards';

interface UseCompletedCredentialsResult {
  credentials: PDA[];
  isLoading: boolean;
}

// Reward types excluded from "past credentials": the recurring monthly
// activity categories (see ACTIVITY_REWARD_TYPES) plus transact_oor, which
// jumper-backend also emits as an activity-style reward but isn't part of the
// Earn XP ongoing-activity tiers.
const NON_CREDENTIAL_REWARD_TYPES: readonly string[] = [
  ...ACTIVITY_REWARD_TYPES,
  'transact_oor',
];

// The wallet's past credentials from the loyalty pass /rewards data — i.e.
// every settled reward that isn't one of the recurring monthly activity
// categories, such as one-off mission or campaign rewards. Newest first.
export const deriveCompletedCredentials = (pdas: PDA[]): PDA[] =>
  (pdas ?? [])
    .filter(
      (pda) =>
        !NON_CREDENTIAL_REWARD_TYPES.includes(pda?.reward?.type) &&
        !pda.ongoing,
    )
    .sort((a, b) => compareDesc(a.timestamp, b.timestamp));

export const useCompletedCredentials = (
  walletAddress?: string,
): UseCompletedCredentialsResult => {
  const { pdas, isLoading } = useLoyaltyPass(walletAddress);

  return { credentials: deriveCompletedCredentials(pdas ?? []), isLoading };
};
