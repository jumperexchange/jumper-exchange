// @mui
import { deDE, enUS } from '@mui/material/locale';
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
    // icon: "/assets/icons/flags/ic_flag_en.svg",
  },
  {
    label: 'Deutsch',
    value: 'de' as DappLanguagesSupported,
    systemValue: deDE,
    // icon: "/assets/icons/flags/ic_flag_de.svg",
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
  themeMode: !!localStorage.getItem(localStorageKey.themeMode)
    ? localStorage.getItem(localStorageKey.themeMode)
    : 'auto',
  languageMode: setLanguage(defaultLang),
  activeWalletName: !!localStorage.getItem(localStorageKey.activeWalletName)
    ? localStorage.getItem(localStorageKey.activeWalletName)
    : false,
};
