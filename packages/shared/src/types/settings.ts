import type { ChainId } from '@lifi/types';
// ----------------------------------------------------------------------

import type { LanguageKey } from '@transferto/dapp/src/types';

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;

export interface SettingsProps {
  themeMode: ThemeModesSupported;
  languageMode: LanguageKey;
  activeWalletName: WalletConnected;
  activeTab: number;
  welcomeScreenEntered: boolean;
  destinationChain: ChainId;
}
export interface SettingsState extends SettingsProps {
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

  // Welcome Screen
  onWelcomeScreenEntered: (shown: boolean) => void;

  // Destination Chain
  onDestinationChainSelected: (chainId: number) => void;
}
