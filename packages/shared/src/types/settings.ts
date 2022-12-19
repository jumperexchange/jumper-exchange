// ----------------------------------------------------------------------

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;
export enum DappLanguagesSupported {
  en = 'en',
  zh = 'zh',
  fr = 'fr',
  de = 'de',
  it = 'it',
}

export type SettingsValueProps = {
  themeMode: ThemeModesSupported;
  languageMode: DappLanguagesSupported;
  activeWalletName: WalletConnected;
  activeTab: number;
};

export type SettingsContextProps = {
  themeMode?: ThemeModesSupported;
  languageMode?: DappLanguagesSupported;
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
  onChangeLanguage: (language: string) => void; // Todo: Check Typing, language: DappLanguagesSupported

  // Direction
  onChangeDirectionByLang: (lang: string) => void;

  // Reset
  onResetSetting: VoidFunction;
};
