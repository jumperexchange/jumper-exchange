'use client';

import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { AdCooldownState } from './types';

/** Ad cooldown: 10 minutes in milliseconds (default duration before showing another ad) */
export const DEFAULT_AD_COOLDOWN_DURATION = 600_000;
/** Ad cooldown: 5 minutes in milliseconds (minimum allowed duration) */
export const MIN_AD_COOLDOWN_DURATION = 300_000;

const initialCooldownState = {
  cooldownTimestamps: {} as Record<string, { timestamp: number; adId: string }>,
  cooldownDuration: DEFAULT_AD_COOLDOWN_DURATION,
  _hasHydrated: false,
};

export const useAdCooldownStore = createWithEqualityFn(
  persist<AdCooldownState>(
    (set, get) => ({
      ...initialCooldownState,

      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

      setAdShown: (walletAddress: string, adId: string) => {
        set({
          cooldownTimestamps: {
            ...get().cooldownTimestamps,
            [walletAddress]: { timestamp: Date.now(), adId },
          },
        });
      },

      isInCooldown: (walletAddress: string): boolean => {
        const { cooldownTimestamps, cooldownDuration } = get();
        const entry = cooldownTimestamps[walletAddress];
        if (!entry) {
          return false;
        }
        return Date.now() - entry.timestamp < cooldownDuration;
      },

      getActiveAdId: (walletAddress: string): string | null => {
        const entry = get().cooldownTimestamps[walletAddress];
        return entry?.adId ?? null;
      },

      setCooldownDuration: (duration: number) =>
        set({
          cooldownDuration:
            duration > MIN_AD_COOLDOWN_DURATION
              ? duration
              : MIN_AD_COOLDOWN_DURATION,
        }),

      clearCooldown: (walletAddress: string) => {
        const next = { ...get().cooldownTimestamps };
        delete next[walletAddress];
        set({ cooldownTimestamps: next });
      },
    }),
    {
      name: 'jumper-ad-cooldown-store',
      version: 1,
      partialize: (state) =>
        ({
          cooldownTimestamps: state.cooldownTimestamps,
          cooldownDuration: state.cooldownDuration,
          // _hasHydrated intentionally excluded — never persisted
        }) as unknown as AdCooldownState,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
  shallow,
);
