// @mui
import type { LanguageKey } from '@transferto/dapp/src/types';
import type { ThemeModesSupported } from './types';

export const cookiesExpires = 3;

export const localStorageKey = {
  activeWalletName: 'activeWalletName',
  themeMode: 'themeMode',
  languageMode: 'languageMode',
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultLang = 'en'; // English
export const LOCAL_STORAGE_WALLETS_KEY = 'li.fi-wallets';

const setLanguage = () => {
  if (!!localStorage.getItem(localStorageKey.languageMode)) {
    return localStorage.getItem(localStorageKey.languageMode);
  } else {
    return '';
  }
};

interface DefaultSettingsType {
  activeTab: number;
  themeMode: ThemeModesSupported;
  languageMode: LanguageKey;
  activeWalletName: string;
  welcomeScreenEntered: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  activeTab: 0,
  themeMode:
    (localStorage.getItem(localStorageKey.themeMode) as ThemeModesSupported) ||
    'auto',
  languageMode: setLanguage() as LanguageKey,
  activeWalletName:
    (localStorage.getItem(localStorageKey.activeWalletName) as string) || '',
  welcomeScreenEntered: false,
};
