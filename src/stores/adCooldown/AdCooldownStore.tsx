'use client';

import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

/** Ad cooldown: 10 minutes in milliseconds (default duration before showing another ad) */
export const DEFAULT_AD_COOLDOWN_DURATION = 600_000;
/** Ad cooldown: 5 minutes in milliseconds (minimum allowed duration) */
export const MIN_AD_COOLDOWN_DURATION = 300_000;

/** Key used when no wallet is connected so cooldown still applies. */
export const NO_WALLET_COOLDOWN_KEY = '__no_wallet__';

export const getCooldownKey = (walletAddress: string): string =>
  walletAddress || NO_WALLET_COOLDOWN_KEY;

interface AdSession {
  timestamp: number;
  adIds: string[];
}

interface AdCooldownState {
  adSession: Record<string, AdSession>;
  cooldownDuration: number;
  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
  setShownCards: (walletAddress: string, adIds: string[]) => void;
  isInCooldown: (walletAddress: string) => boolean;
  isCardRegistered: (walletAddress: string, adId: string) => boolean;
  setCooldownDuration: (duration: number) => void;
  clearCooldown: (walletAddress: string) => void;
}

export const useAdCooldownStore = createWithEqualityFn(
  persist<AdCooldownState>(
    (set, get) => ({
      adSession: {},
      cooldownDuration: DEFAULT_AD_COOLDOWN_DURATION,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      // Simple setter — caller is responsible for checking cooldown before calling
      setShownCards: (walletAddress, adIds) => {
        const key = getCooldownKey(walletAddress);
        set((state) => ({
          adSession: {
            ...state.adSession,
            [key]: { timestamp: Date.now(), adIds },
          },
        }));
      },

      isInCooldown: (walletAddress) => {
        const { adSession, cooldownDuration } = get();
        const entry = adSession[getCooldownKey(walletAddress)];
        if (!entry) {
          return false;
        }
        return Date.now() - entry.timestamp < cooldownDuration;
      },

      isCardRegistered: (walletAddress, adId) => {
        const entry = get().adSession[getCooldownKey(walletAddress)];
        return entry?.adIds.includes(adId) ?? false;
      },

      setCooldownDuration: (duration) =>
        set({
          cooldownDuration: Math.max(duration, MIN_AD_COOLDOWN_DURATION),
        }),

      clearCooldown: (walletAddress) => {
        set((state) => {
          const next = { ...state.adSession };
          delete next[getCooldownKey(walletAddress)];
          return { adSession: next };
        });
      },
    }),
    {
      name: 'jumper-ad-cooldown-store',
      version: 1,
      partialize: (state) =>
        ({
          adSession: state.adSession,
          cooldownDuration: state.cooldownDuration,
          // _hasHydrated intentionally excluded — never persisted
        }) as unknown as AdCooldownState,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
  shallow,
);
