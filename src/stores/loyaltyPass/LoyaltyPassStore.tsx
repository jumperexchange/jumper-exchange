import type { LoyaltyPassState, PDA } from '@/types/loyaltyPass';
import { SettingsProps, ThemeModesSupported } from '@/types/settings';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useLoyaltyPassStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      address: undefined,
      points: undefined,
      tier: undefined,
      pdas: [],
      timestamp: undefined,

      setValue: (key: keyof SettingsProps, value: SettingsProps) =>
        set(() => ({
          [key]: value,
        })),

      setValues: (values: { [x: string]: any }) =>
        set((state: SettingsProps) => {
          const updatedState: SettingsProps = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),

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
      version: 1,
    },
  ) as unknown as StateCreator<LoyaltyPassState, [], [], LoyaltyPassState>,
  shallow,
);
