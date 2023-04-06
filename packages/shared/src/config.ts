// @mui
import type { LanguageKey } from '../../dapp/src/types';
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
}

export const defaultSettings: DefaultSettingsType = {
  activeTab: 0,
  themeMode: !!localStorage.getItem(localStorageKey.themeMode)
    ? (localStorage.getItem(localStorageKey.themeMode) as ThemeModesSupported)
    : 'auto',
  languageMode: setLanguage() as LanguageKey,
  activeWalletName: !!localStorage.getItem(localStorageKey.activeWalletName)
    ? (localStorage.getItem(localStorageKey.activeWalletName) as string)
    : '',
};

interface defaultMenuType {
  openMainNavbarMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarChainsMenu: boolean;
  openNavbarWalletSelectMenu: boolean;
  openNavbarSubMenu: string;
  openSupportModal: boolean;
  anchorEl: null | JSX.Element;
}

export const defaultMenu: defaultMenuType = {
  openMainNavbarMenu: false,
  openNavbarWalletSelectMenu: false,
  openNavbarChainsMenu: false,
  openNavbarWalletSelectMenu: false,
  openNavbarSubMenu: 'none',
  openSupportModal: false,
  anchorEl: null,
};
