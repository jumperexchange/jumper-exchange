// ----------------------------------------------------------------------

import type { PartnerThemesData } from '@/types/strapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { FormState, WidgetConfig } from '@lifi/widget';
import { RefObject } from 'react';

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

  setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => void;
  setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => void; // maybe config

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
