// @mui
import { deDE, enUS } from '@mui/material/locale';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { DappLanguagesSupported, SettingsValueProps } from './types/settings';

export const cookiesExpires = 3;

export const cookiesKey = {
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
  } else if (!!Cookies.get(cookiesKey.languageMode)) {
    return Cookies.get(cookiesKey.languageMode);
  } else {
    return defaultLang.value;
  }
};

export const defaultSettings: SettingsValueProps = {
  themeMode: !!Cookies.get(cookiesKey.themeMode)
    ? Cookies.get(cookiesKey.themeMode)
    : 'light',
  languageMode: setLanguage(defaultLang),
};
