// @mui
import { deDE, enUS, frFR, itIT, zhCN } from '@mui/material/locale';
import i18next from 'i18next';
import { DappLanguagesSupported } from './types/settings';

export const cookiesExpires = 3;

export const localStorageKey = {
  activeWalletName: 'activeWalletName',
  themeMode: 'themeMode',
  languageMode: 'languageMode',
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en' as DappLanguagesSupported,
    systemValue: enUS,
  },
  {
    label: 'Deutsch',
    value: 'de' as DappLanguagesSupported,
    systemValue: deDE,
  },
  {
    label: 'Italian',
    value: 'it' as DappLanguagesSupported,
    systemValue: itIT,
  },
  {
    label: 'Chinese',
    value: 'zh' as DappLanguagesSupported,
    systemValue: zhCN,
  },
  {
    label: 'French',
    value: 'fr' as DappLanguagesSupported,
    systemValue: frFR,
  },
];

export const defaultLang = allLangs[0]; // English

const setLanguage = (defaultLang) => {
  if (!!i18next.language) {
    return i18next.language;
  } else if (!!localStorage.i18nextLng) {
    return localStorage.i18nextLng;
  } else if (!!localStorage.getItem(localStorageKey.languageMode)) {
    return localStorage.getItem(localStorageKey.languageMode);
  } else {
    return defaultLang.value;
  }
};

export const defaultSettings: any = {
  activeTab: 0,
  themeMode: !!localStorage.getItem(localStorageKey.themeMode)
    ? localStorage.getItem(localStorageKey.themeMode)
    : 'auto',
  languageMode: setLanguage(defaultLang),
  activeWalletName: !!localStorage.getItem(localStorageKey.activeWalletName)
    ? localStorage.getItem(localStorageKey.activeWalletName)
    : false,
};

export const defaultMenu: any = {
  copiedToClipboard: false,
  openMainNavbarMenu: false,
  openNavbarWalletMenu: false,
  openNavbarConnectedMenu: false,
  openNavbarSubMenu: 'none',
  openSupportModal: false,
};
