import {
  SettingsContextProps,
  SettingsValueProps,
  ThemeModesSupported,
  WalletConnected,
} from '@transferto/shared/src/types';
import i18next from 'i18next';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  defaultLang,
  defaultSettings,
  localStorageKey,
} from '../config/config';
import { useSharedSettings } from '../providers';
import { LanguageKey } from '../types';

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

export function useSettings() {
  const [state, setState] = useSharedSettings();

  // Tabs
  const onChangeTab = useCallback(
    (tab: number) => {
      setState((oldSettings) => ({
        ...oldSettings,
        activeTab: !!tab ? tab : 0,
      }));
    },
    [setState],
  );

  // Wallet
  const onWalletConnect = useCallback(
    (activeWalletName: string) => {
      localStorage.setItem(localStorageKey.activeWalletName, activeWalletName);
      setState((oldSettings) => ({
        ...oldSettings,
        activeWalletName: activeWalletName as WalletConnected,
      }));
    },
    [setState],
  );

  const onWalletDisconnect = useCallback(() => {
    localStorage.setItem(localStorageKey.activeWalletName, 'none');
    setState((oldSettings) => ({
      ...oldSettings,
      activeWalletName: 'none',
    }));
  }, [setState]);

  // Mode
  const onChangeMode = useCallback(
    (mode: ThemeModesSupported) => {
      localStorage.setItem(localStorageKey.themeMode, mode);
      setState((oldSettings) => ({
        ...oldSettings,
        themeMode: mode as ThemeModesSupported,
      }));
    },
    [setState],
  );

  // Language
  const onChangeLanguage = useCallback(
    (language: LanguageKey) => {
      localStorage.setItem(localStorageKey.languageMode, language);
      setState((oldSettings) => ({
        ...oldSettings,
        languageMode: language as LanguageKey,
      }));
    },
    [setState],
  );

  // Reset
  const onResetSetting = useCallback(() => {
    setState((oldSettings) => ({
      ...oldSettings,
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
  }, [setState]);

  return {
    settings: state,
    onChangeTab,
    onResetSetting,
    onChangeLanguage,
    onChangeMode,
    onWalletDisconnect,
    onWalletConnect,
  };
}
