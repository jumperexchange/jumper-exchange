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
        });
      },
    }),
    {
      name: 'jumper-store', // name of the item in the storage (must be unique)
      version: 7,
      migrate: (persistedState: SettingsProps, version) => {
        const newStore = { ...persistedState };
        Object.keys(defaultSettings)
          .filter((el) => !(el in persistedState))
          .forEach((el) => delete newStore[el]);

        return newStore;
      },
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ) as unknown as StateCreator<SettingsState, [], [], SettingsState>,
);
