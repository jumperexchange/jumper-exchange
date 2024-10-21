import { defaultSettings } from '@/config/config';
import type { SettingsProps, SettingsState } from '@/types/settings';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const createSettingsStore = (props: Partial<SettingsProps>) =>
  createWithEqualityFn(
    persist(
      (set, get) => ({
        ...defaultSettings,
        ...props,
        // Installed Wallets
        setClientWallets: (wallet: string) => {
          const clientWallets = (get() as SettingsProps)?.clientWallets;
          !clientWallets.includes(wallet) &&
            set({
              clientWallets: [...clientWallets, wallet],
            });
        },

        // Disable Feature Card
        setDisabledFeatureCard: (id: string) => {
          const disabledFeatureCards = (get() as SettingsProps)
            ?.disabledFeatureCards;
          id &&
            !disabledFeatureCards.includes(id) &&
            set({
              disabledFeatureCards: [...disabledFeatureCards, id],
            });
        },

        // Welcome Screen
        setWelcomeScreenClosed: (shown: boolean) => {
          set({
            welcomeScreenClosed: shown,
          });
        },

        // Reset
        setDefaultSettings: () => {
          set({
            disabledFeatureCards: defaultSettings.disabledFeatureCards || [],
          });
        },
      }),
      {
        name: 'jumper-store',
        version: 2,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            const newStore = { ...persistedState };
            Object.keys(persistedState)
              .filter((el) => !(el in defaultSettings))
              .forEach((el) => delete newStore[el]);
            return newStore;
          }
          return persistedState;
        },
      },
    ) as StateCreator<SettingsState, [], [], SettingsState>,
    shallow,
  );
