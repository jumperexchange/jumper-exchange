import { localStorageKey } from '@transferto/shared/src/config';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
// config
import i18next from 'i18next';
import { defaultSettings } from '../index';
// @type
import type { LanguageKey } from '../../../dapp/src/types';
import { defaultLang } from '../config';
import type {
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
  onChangeMode: () => {},

  // Tabs
  onChangeTab: () => {},

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

  // Tabs
  const onChangeTab = (tab: number) => {
    setSettings((oldSettings) => ({
      ...oldSettings,
      activeTab: !!tab ? tab : 0,
    }));
  };

  // Wallet
  const onWalletConnect = (activeWalletName: string) => {
    setSettings((oldSettings) => ({
      ...oldSettings,
      activeWalletName: activeWalletName as WalletConnected,
    }));
  };

  const onWalletDisconnect = () => {
    setSettings((oldSettings) => ({
      ...oldSettings,
      activeWalletName: 'none',
    }));
  };

  // Mode
  const onChangeMode = (mode: ThemeModesSupported) => {
    setSettings((oldSettings) => ({
      ...oldSettings,
      themeMode: mode as ThemeModesSupported,
    }));
  };

  // Language
  const onChangeLanguage = (language: LanguageKey) => {
    setSettings((oldSettings) => ({
      ...oldSettings,
      languageMode: language as LanguageKey,
    }));
  };

  // Reset
  const onResetSetting = () => {
    setSettings(() => ({
      activeWalletName: !!initialState.activeWalletName
        ? initialState.activeWalletName
        : 'none',
      themeMode: !!initialState.themeMode
        ? initialState.themeMode
        : ('auto' as ThemeModesSupported),
      languageMode:
        initialState.languageMode ||
        (i18next.language as LanguageKey) ||
        defaultLang,
      activeTab: !!initialState.activeTab ? initialState.activeTab : 0,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // Tabs
        onChangeTab,

        // Wallet
        onWalletConnect,
        onWalletDisconnect,

        // Mode
        onChangeMode,

        // Language
        onChangeLanguage,

        // Reset
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// ----------------------------------------------------------------------

const useSettingLocalStorage = (
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] => {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = useCallback(async () => {
    const activeWalletName = !!settings.activeWalletName
      ? settings.activeWalletName
      : 'none';
    localStorage.setItem(localStorageKey.activeWalletName, activeWalletName);
    const themeMode = !!settings.themeMode ? settings.themeMode : 'auto';
    localStorage.setItem(localStorageKey.themeMode, themeMode);
    localStorage.setItem(localStorageKey.languageMode, settings.languageMode);
  }, [settings.activeWalletName, settings.languageMode, settings.themeMode]);

  useEffect(() => {
    onChangeSetting();
  }, [onChangeSetting, settings]);

  return [settings, setSettings];
};

export { SettingsProvider, SettingsContext };
