import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// config
import { defaultSettings } from '@transferto/shared/src';
import i18next from 'i18next';
// @type
import { defaultLang } from '@transferto/shared/src/config';
import type {
  ThemeModesSupported,
  WalletConnected,
} from '@transferto/shared/src/types/settings';
import type { LanguageKey } from '../../types';

// ----------------------------------------------------------------------

/*--  Use Zustand  --*/

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...defaultSettings,

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
          activeWalletName: !!defaultSettings.activeWalletName
            ? defaultSettings.activeWalletName
            : 'none',
          themeMode: !!defaultSettings.themeMode
            ? defaultSettings.themeMode
            : ('auto' as ThemeModesSupported),
          languageMode:
            defaultSettings.languageMode ||
            (i18next.language as LanguageKey) ||
            defaultLang,
          activeTab: !!defaultSettings.activeTab
            ? defaultSettings.activeTab
            : 0,
        });
      },
    }),
    {
      name: 'jumper-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
