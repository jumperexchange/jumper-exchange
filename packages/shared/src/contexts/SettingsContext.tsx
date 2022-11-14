import { cookiesKey } from '@transferto/shared/src/config';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
// utils
// config
import i18next from 'i18next';
import { cookiesExpires, defaultSettings } from '../index';
// @type
import {
  DappLanguagesSupported,
  SettingsContextProps,
  SettingsValueProps,
  ThemeMode,
} from '../types/settings';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},

  // Direction
  onChangeDirectionByLang: () => {},

  // Language
  onChangeLanguage: () => {},

  // Reset
  onResetSetting: () => {},
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

const SettingsProvider = ({
  children,
  defaultSettings,
}: SettingsProviderProps) => {
  const [settings, setSettings] = useSettingCookies(defaultSettings);
  // const langStorage =
  //   typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : '';

  // Mode
  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  // Language
  const onChangeLanguage = (language: string) => {
    setSettings({
      ...settings,
      languageMode: language as DappLanguagesSupported,
    });
  };

  // Direction
  const onChangeDirectionByLang = (lang: DappLanguagesSupported) => {
    setSettings({
      ...settings,
      languageMode: lang ? lang : DappLanguagesSupported.en,
    });
  };

  // Reset

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode || 'light',
      languageMode:
        initialState.languageMode ||
        (i18next.language as DappLanguagesSupported) ||
        DappLanguagesSupported.en,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // Mode
        onToggleMode,
        onChangeMode,

        // Language
        onChangeLanguage,
        onChangeDirectionByLang,

        // Reset
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------

const useSettingCookies = (
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] => {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const { i18n } = useTranslation();

  const onChangeSetting = () => {
    Cookies.set(
      cookiesKey.themeMode
        ? cookiesKey.themeMode
        : window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark',
      settings.themeMode,
      {
        expires: cookiesExpires,
      },
    );

    Cookies.set(cookiesKey.languageMode, i18n.language, {
      expires: cookiesExpires,
    });
  };

  useEffect(() => {
    onChangeSetting();
  }, [settings]);

  return [settings, setSettings];
};
