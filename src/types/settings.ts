// ----------------------------------------------------------------------

import type { PartnerThemesData } from '@/types/strapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { WidgetConfig } from '@lifi/widget';

export type ThemeModesSupported = 'light' | 'dark' | 'system';
export type WalletConnected = string;

export interface SettingsProps {
  partnerThemes: PartnerThemesData[];
  activeTheme: string;
  widgetTheme: { config: Partial<WidgetConfig> };
  configTheme: PartnerThemeConfig;
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

  setActiveTheme: (activeTheme: any) => void;
  setConfigTheme: (configTheme: any) => void;
  setWidgetTheme: (widgetTheme: any) => void;

  setPortfolioLastValue: (portfolioLastValue: number) => void;

  // Installed Wallets
  setClientWallets: (wallet: string) => void;

  // Disable Feature Cards
  setDisabledFeatureCard: (id: string) => void;

  // Reset
  setDefaultSettings: VoidFunction;

  // Welcome Screen
  setWelcomeScreenClosed: (shown: boolean) => void;

  setPartnerThemes: (themes: PartnerThemesData[]) => void;
}
