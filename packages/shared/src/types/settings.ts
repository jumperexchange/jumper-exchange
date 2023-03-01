// ----------------------------------------------------------------------

import type { LanguageKey } from '../../../dapp/src/types';

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;

export type SettingsValueProps = {
  themeMode: ThemeModesSupported;
  languageMode: LanguageKey;
  activeWalletName: WalletConnected;
  activeTab: number;
};

export type SettingsContextProps = {
  themeMode?: ThemeModesSupported;
  languageMode?: LanguageKey;
  activeTab?: number;
  activeWalletName?: WalletConnected;

  // Wallet
  onWalletConnect: (activeWalletName: string) => void;
  onWalletDisconnect: VoidFunction;

  // Tabs
  onChangeTab: (tab: number) => void;

  // Mode
  onChangeMode: (mode: ThemeModesSupported) => void;

  // Language
  onChangeLanguage: (language: LanguageKey) => void;

  // Reset
  onResetSetting: VoidFunction;
};
