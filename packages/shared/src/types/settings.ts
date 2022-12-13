// ----------------------------------------------------------------------

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;
export enum DappLanguagesSupported {
  en = 'en',
  ch = 'ch',
  fr = 'fr',
  de = 'de',
  it = 'it',
}

export type SettingsValueProps = {
  themeMode: ThemeModesSupported;
  languageMode: DappLanguagesSupported;
  activeWalletName: WalletConnected;
  activeTab: number;
  copiedToClipboard: boolean;
  openMainNavbarMenu: boolean;
  openNavbarWalletMenu: boolean;
  openNavbarConnectedMenu: boolean;
  openNavbarSubMenu: string;
};

export type SettingsContextProps = {
  themeMode?: ThemeModesSupported;
  languageMode?: DappLanguagesSupported;
  activeTab?: number;
  activeWalletName?: WalletConnected;
  copiedToClipboard?: boolean;
  openMainNavbarMenu?: boolean;
  openNavbarWalletMenu?: boolean;
  openNavbarConnectedMenu?: boolean;
  openNavbarSubMenu?: string;

  // Wallet
  onWalletConnect: (activeWalletName: string) => void;
  onWalletDisconnect: VoidFunction;

  // ClipBoard
  onCopyToClipboard: (copied: boolean) => void;

  // Close ALL Navbar Menus
  onCloseAllNavbarMenus: () => void;

  // Toggle Navbar Main Menu
  onOpenNavbarMainMenu: (open: boolean) => void;

  // Toggle Navbar Wallet Menu
  onOpenNavbarWalletMenu: (open: boolean) => void;

  // Toggle Navbar Connected Menu
  onOpenNavbarConnectedMenu: (open: boolean) => void;

  // Toggle Navbar Sub Menu
  onOpenNavbarSubMenu: (subMenu: string) => void;

  // Tabs
  onChangeTab: (tab: number) => void;

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
