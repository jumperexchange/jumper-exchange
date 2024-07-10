// ----------------------------------------------------------------------

export type ThemeModesSupported = 'light' | 'dark' | 'auto';
export type WalletConnected = string;

export interface SettingsProps {
  activeTheme: any;
  themeMode: ThemeModesSupported;
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}
export interface SettingsState extends SettingsProps {
  // Tabs
  onChangeTab: (tab: number) => void;

  // Mode
  setThemeMode: (mode: ThemeModesSupported) => void;

  // Mode
  setActiveTheme: (activeTheme: any) => void;

  // Installed Wallets
  setClientWallets: (wallet: string) => void;

  // Disable Feature Cards
  setDisabledFeatureCard: (id: string) => void;

  // Reset
  setDefaultSettings: VoidFunction;

  // Welcome Screen
  setWelcomeScreenClosed: (shown: boolean) => void;
}
