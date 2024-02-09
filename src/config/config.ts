// @mui
import type { LanguageKey, ThemeModesSupported } from '../types';

export const cookiesExpires = 3;

export const localStorageKey = {
  activeTab: 'activeTab',
  activeWalletName: 'activeWalletName',
  themeMode: 'themeMode',
  clientWallets: 'clientWallets',
  languageMode: 'languageMode',
  disabledFeatureCards: 'disabledFeatureCards',
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultLang = 'en'; // English

const setLanguage = () => {
  // if (
  //   typeof window === 'undefined' &&
  //   !!localStorage.getItem(localStorageKey.languageMode)
  // ) {
  //   return localStorage.getItem(localStorageKey.languageMode);
  // } else {
  return '';
  // }
};

interface DefaultSettingsType {
  themeMode: ThemeModesSupported;
  languageMode: LanguageKey;
  activeWalletName: string;
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  themeMode:
    // (typeof window === 'undefined' &&
    //   (localStorage.getItem(
    //     localStorageKey.themeMode,
    //   ) as ThemeModesSupported)) ||
    'auto',
  languageMode: setLanguage() as LanguageKey,
  clientWallets: [],
  activeWalletName:
    // (typeof window === 'undefined' &&
    //   (localStorage.getItem(localStorageKey.activeWalletName) as string)) ||
    '',
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
};
