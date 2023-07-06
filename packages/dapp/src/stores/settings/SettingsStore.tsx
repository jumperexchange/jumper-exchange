import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// config
import { defaultLang, defaultSettings } from '@transferto/shared/src';
// @type
import type {
  SettingsProps,
  SettingsState,
  ThemeModesSupported,
  WalletConnected,
} from '@transferto/shared/src/types/settings';
import i18next from 'i18next';
import { TabsMap } from '../../const/tabsMap';
import { LanguageKey } from '../../types';

// ----------------------------------------------------------------------

/*--  Use Zustand  --*/

export const useSettingsStore = create(
  persist(
    (set) => ({
      ...defaultSettings,
      setValue: (key, value) =>
        set(() => ({
          [key]: value,
        })),
      setValues: (values) =>
        set((state) => {
          const updatedState: SettingsProps = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),

      // Tabs
      onChangeTab: (tab: number) => {
        set({
          activeTab: tab || TabsMap.Exchange.index,
        });
      },

      // Wallet
      onWalletConnect: (activeWalletName: WalletConnected) => {
        set({
          activeWalletName,
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
          themeMode: mode,
        });
      },

      // Language
      onChangeLanguage: (language: LanguageKey) => {
        set({
          languageMode: language,
        });
      },

      // Welcome Screen
      onWelcomeScreenEntered: (shown: boolean) => {
        set({
          welcomeScreenEntered: shown,
        });
      },

      // Reset
      onResetSetting: () => {
        set({
          activeWalletName: defaultSettings.activeWalletName || 'none',
          themeMode:
            defaultSettings.themeMode || ('auto' as ThemeModesSupported),
          languageMode:
            defaultSettings.languageMode ||
            (i18next.language as LanguageKey) ||
            defaultLang,
          activeTab: defaultSettings.activeTab || TabsMap.Exchange.index,
        });
      },
    }),
    {
      name: 'jumper-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ) as unknown as StateCreator<SettingsState, [], [], SettingsState>,
);
