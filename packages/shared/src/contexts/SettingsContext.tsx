import { localStorageKey } from '@transferto/shared/src/config';
import React from 'react';
// import { useTranslation, i18n } from 'react-i18next';

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
import { defaultSettings } from '../index';
// @type
import {
  DappLanguagesSupported,
  SettingsContextProps,
  SettingsValueProps,
  ThemeModesSupported,
  WalletConnected,
} from '../types/settings';

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Wallet
  onWalletConnect: () => {},
  onWalletDisconnect: () => {},

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
  const [settings, setSettings] = useSettingLocalStorage(defaultSettings);

  // Wallet
  const onWalletConnect = (activeWalletName: string) => {
    setSettings({
      ...settings,
      activeWalletName: activeWalletName as WalletConnected,
      // settings.activeWalletName === 'none' ? 'none' : activeWalletName,
    });
  };

  const onWalletDisconnect = () => {
    setSettings({
      ...settings,
      activeWalletName: 'none',
    });
  };

  // Mode
  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeMode = (mode: ThemeModesSupported) => {
    setSettings({
      ...settings,
      themeMode: mode as ThemeModesSupported,
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
      activeWalletName: !!initialState.activeWalletName
        ? initialState.activeWalletName
        : 'none',
      themeMode: !!initialState.themeMode ? initialState.themeMode : 'auto',
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

        // Wallet
        onWalletConnect,
        onWalletDisconnect,

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

const useSettingLocalStorage = (
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] => {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    localStorage.setItem(
      localStorageKey.activeWalletName,
      !!settings.activeWalletName ? settings.activeWalletName : 'none',
    );
    localStorage.setItem(
      localStorageKey.themeMode,
      !!settings.themeMode ? settings.themeMode : 'auto',
    );
    localStorage.setItem(localStorageKey.languageMode, settings.languageMode);
  };

  useEffect(() => {
    onChangeSetting();
  }, [settings]);

  return [settings, setSettings];
};
