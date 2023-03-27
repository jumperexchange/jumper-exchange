import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// config
import { defaultSettings } from '@transferto/shared/src';
import i18next from 'i18next';
// @type
import { defaultLang } from '@transferto/shared/src/config';
import type {
  SettingsContextProps,
  ThemeModesSupported,
  WalletConnected,
} from '@transferto/shared/src/types/settings';
import type { LanguageKey } from '../../types';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Wallet
  onWalletConnect: () => {},
  onWalletDisconnect: () => {},

  // Mode
  onChangeMode: () => {},

  // Tabs
  onChangeTab: () => {},

  // Language
  onChangeLanguage: () => {},

  // Reset
  onResetSetting: () => {},
};

/*--  Use Zustand  --*/

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...defaultSettings,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),

      removeAllBears: () => set({ bears: 0 }),

      // Tabs
      onChangeTab: (tab: number) =>
        set({
          activeTab: !!tab ? tab : 0,
        }),

      // Wallet
      onWalletConnect: (activeWalletName: string) => {
        set({
          activeWalletName: activeWalletName as WalletConnected,
        });
      },

      onWalletDisconnect: () => {
        set({
          activeWalletName: 'none',
        });
      },

      // Mode
      onChangeMode: (mode: ThemeModesSupported) => {
        set({
          themeMode: mode as ThemeModesSupported,
        });
      },

      // Language
      onChangeLanguage: (language: LanguageKey) => {
        set({
          languageMode: language as LanguageKey,
        });
      },

      // Reset
      onResetSetting: () => {
        set({
          activeWalletName: !!initialState.activeWalletName
            ? initialState.activeWalletName
            : 'none',
          themeMode: !!initialState.themeMode
            ? initialState.themeMode
            : ('auto' as ThemeModesSupported),
          languageMode:
            initialState.languageMode ||
            (i18next.language as LanguageKey) ||
            defaultLang,
          activeTab: !!initialState.activeTab ? initialState.activeTab : 0,
        });
      },
    }),
    {
      name: 'settings-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
