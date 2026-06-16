import { useContext } from 'react';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';

/**
 * The perks a wallet has unlocked: those whose `UnlockLevel` is at or below the
 * wallet's current loyalty level. Single source of truth for "unlocked perks"
 * so the Jumper Pass stat and the Unlocked Perks section stay in agreement.
 */
export const useUnlockedPerks = (perks: PerksDataAttributes[]) => {
  const { walletAddress } = useContext(ProfileContext);
  const { level, isLoading } = useLoyaltyPass(walletAddress);
  const currentLevel = Number(level ?? 0);
  const unlockedPerks = perks.filter(
    (perk) => perk.UnlockLevel <= currentLevel,
  );

  return { unlockedPerks, isLoading };
};
