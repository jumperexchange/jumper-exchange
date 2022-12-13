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

  // Tabs
  onChangeTab: () => {},

  // CopyClipboard
  onCopyToClipboard: () => {},

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => {},

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: () => {},

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: () => {},

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: () => {},

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: () => {},

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

  // Tabs
  const onChangeTab = (tab: number) => {
    setSettings({ ...settings, activeTab: !!tab ? tab : 0 });
  };

  // CopyToClipboard
  const onCopyToClipboard = (copied: boolean) => {
    setSettings({
      ...settings,
      copiedToClipboard: copied as boolean,
    });
  };

  // Close ALL Navbar Menus
  const onCloseAllNavbarMenus = () => {
    setSettings({
      ...settings,
      openMainNavbarMenu: false,
      openNavbarWalletMenu: false,
      openNavbarConnectedMenu: false,
      openNavbarSubMenu: 'none',
      copiedToClipboard: false,
    });
  };

  // Toggle Navbar Main Menu
  const onOpenNavbarMainMenu = (open: boolean) => {
    setSettings({
      ...settings,
      openMainNavbarMenu: open as boolean,
    });
  };

  // Toggle Navbar Wallet Menu
  const onOpenNavbarWalletMenu = (open: boolean) => {
    setSettings({
      ...settings,
      openNavbarWalletMenu: open as boolean,
    });
  };

  // Toggle Navbar Connected Menu
  const onOpenNavbarConnectedMenu = (open: boolean) => {
    setSettings({
      ...settings,
      openNavbarConnectedMenu: open as boolean,
    });
  };

  // Toggle Navbar Sub Menu
  const onOpenNavbarSubMenu = (subMenu: string) => {
    setSettings({
      ...settings,
      openNavbarSubMenu: subMenu as string,
    });
  };

  // Wallet
  const onWalletConnect = (activeWalletName: string) => {
    setSettings({
      ...settings,
      activeWalletName: activeWalletName as WalletConnected,
    });
  };

  const onWalletDisconnect = () => {
    setSettings({
      ...settings,
      activeWalletName: 'none',
      openNavbarConnectedMenu: false,
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
      activeTab: !!initialState.activeTab ? initialState.activeTab : 0,
      copiedToClipboard: !!initialState.copiedToClipboard
        ? initialState.copiedToClipboard
        : false,
      openMainNavbarMenu: !!initialState.openMainNavbarMenu
        ? initialState.openMainNavbarMenu
        : false,
      openNavbarWalletMenu: !!initialState.openNavbarWalletMenu
        ? initialState.openNavbarWalletMenu
        : false,
      openNavbarConnectedMenu: !!initialState.openNavbarConnectedMenu
        ? initialState.openNavbarConnectedMenu
        : false,
      openNavbarSubMenu: !!initialState.openNavbarSubMenu
        ? initialState.openNavbarSubMenu
        : 'none',
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // Tabs
        onChangeTab,

        // CopyToClipboard
        onCopyToClipboard,

        // Close ALL Navbar Menus
        onCloseAllNavbarMenus,

        // Toggle Navbar Main Menu
        onOpenNavbarMainMenu,

        // Toggle Navbar Wallet Menu
        onOpenNavbarWalletMenu,

        // Toggle Navbar Connected Menu
        onOpenNavbarConnectedMenu,

        // Toggle Navbar Sub Menu
        onOpenNavbarSubMenu,

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

export { SettingsProvider, SettingsContext };
