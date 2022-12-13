// ----------------------------------------------------------------------

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;
export enum DappLanguagesSupported {
  // Todo: Check Typing, does it fit here?
  // It´s meant for dapp, but is placed in shared folder, can I pass those types?
  en = 'en',
  de = 'de',
}

export type SettingsValueProps = {
  themeMode: ThemeModesSupported;
  languageMode: DappLanguagesSupported; // Todo: Same here, languages supported depends on app
  activeWalletName: WalletConnected;
};

export type SettingsContextProps = {
  themeMode?: ThemeModesSupported;
  languageMode?: DappLanguagesSupported; // Todo: Same here, languages supported depends on app
  activeWalletName?: WalletConnected;

  // Wallet
  onWalletConnect: (activeWalletName: string) => void;
  onWalletDisconnect: VoidFunction;

  // Mode
  onToggleMode: VoidFunction;
  onChangeMode: (mode: ThemeModesSupported) => void;

  // Language
  onChangeLanguage: (language: string) => void; // Todo: Check Typing, language: DappLanguagesSupported

  // Direction
  onChangeDirectionByLang: (lang: string) => void;

  // Reset
  onResetSetting: VoidFunction;
};
