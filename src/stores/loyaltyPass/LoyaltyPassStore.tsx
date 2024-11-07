import type {
  LoyaltyPassProps,
  LoyaltyPassState,
  PDA,
} from '@/types/loyaltyPass';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useLoyaltyPassStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      address: undefined,
      points: undefined,
      level: undefined,
      pdas: [],
      timestamp: undefined,

      reset: () => {
        set({
          address: undefined,
          points: undefined,
          level: undefined,
          pdas: [],
          timestamp: undefined,
        });
      },

      // Loyalty Pass Information
      setLoyaltyPassData: (
        address: string,
        points: number,
        level: string,
        pdas: PDA[],
        time: number,
      ) => {
        set({
          address: address,
          points: points,
          level: level,
          pdas: pdas,
          timestamp: time,
        });
      },
    }),
    {
      name: 'jumper-loyalty-pass', // name of the item in the storage (must be unique)
      version: 3,
      migrate: (persistedState, version) => {
        if (version === 1) {
          // if the stored value is in version 1, we clear the storage
          persistedState = {};
        }

        if (version === 2) {
          const state = persistedState as LoyaltyPassProps & { tier?: string };
          state.level = state.tier;
          delete state.tier;

          persistedState = state;
        }

        return persistedState;
      },
    },
  ) as unknown as StateCreator<LoyaltyPassState, [], [], LoyaltyPassState>,
  shallow,
);
