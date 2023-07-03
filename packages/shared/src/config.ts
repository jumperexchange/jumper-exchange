// @mui
import { TabsMap } from '@transferto/dapp/src/const/tabsMap';
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
  activeTab: TabsMap.Exchange,
  themeMode:
    (localStorage.getItem(localStorageKey.themeMode) as ThemeModesSupported) ||
    'auto',
  languageMode: setLanguage() as LanguageKey,
  activeWalletName:
    (localStorage.getItem(localStorageKey.activeWalletName) as string) || '',
  welcomeScreenEntered: false,
};
