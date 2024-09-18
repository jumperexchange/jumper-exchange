import type { LoyaltyPassState, PDA } from '@/types/loyaltyPass';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn as create } from 'zustand/traditional';

export const useLoyaltyPassStore = create(
  persist(
    (set, get) => ({
      address: undefined,
      points: undefined,
      tier: undefined,
      pdas: [],
      timestamp: undefined,

      reset: () => {
        set({
          address: undefined,
          points: undefined,
          tier: undefined,
          pdas: [],
          timestamp: undefined,
        });
      },

      // Loyalty Pass Information
      setLoyaltyPassData: (
        address: string,
        points: number,
        tier: string,
        pdas: PDA[],
        time: number,
      ) => {
        set({
          address: address,
          points: points,
          tier: tier,
          pdas: pdas,
          timestamp: time,
        });
      },
    }),
    {
      name: 'jumper-loyalty-pass', // name of the item in the storage (must be unique)
      version: 2,
      migrate: (persistedState, version) => {
        if (version === 1) {
          // if the stored value is in version 1, we clear the storage
          persistedState = {};
        }

        return persistedState;
      },
    },
  ) as unknown as StateCreator<LoyaltyPassState, [], [], LoyaltyPassState>,
  shallow,
);
