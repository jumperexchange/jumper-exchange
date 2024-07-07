import { defaultSettings } from '@/config/config';
import type {
  SettingsProps,
  SettingsState,
  ThemeModesSupported,
} from '@/types/settings';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

// ----------------------------------------------------------------------

/*-- Use Zustand --*/

const createSettingsStore = (set: any, get: any) => ({
  ...defaultSettings,

  // Mode
  setThemeMode: (mode: ThemeModesSupported) => {
    set((state: SettingsState) => ({
      ...state,
      themeMode: mode,
    }));
  },
  // Installed Wallets
  setClientWallets: (wallet: string) => {
    const clientWallets = (get() as SettingsProps)?.clientWallets;
    !clientWallets.includes(wallet) &&
      set({
        clientWallets: [...clientWallets, wallet],
      });
  },

  setPartnerThemeUid: (partnerThemeUid: string) => {
    set((state: SettingsState) => ({
      ...state,
      partnerThemeUid: partnerThemeUid,
    }));
  },

  // Disable Feature Card
  setDisabledFeatureCard: (id: string) => {
    const disabledFeatureCards = (get() as SettingsProps)?.disabledFeatureCards;
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
      themeMode: defaultSettings.themeMode || ('auto' as ThemeModesSupported),
      disabledFeatureCards: defaultSettings.disabledFeatureCards || [],
    });
  },
});

const isClient = typeof window !== 'undefined' && window.localStorage;

const persistedStore = isClient
  ? persist(createSettingsStore, {
      name: 'jumper-store',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version > 1) {
          // Migration logic if needed
        }
        return persistedState;
      },
    })
  : createSettingsStore;

export const useSettingsStore = createWithEqualityFn(
  persistedStore as unknown as StateCreator<
    SettingsState,
    [],
    [],
    SettingsState
  >,
  shallow,
);
