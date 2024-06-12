// @mui

import type { ThemeModesSupported } from '@/types/settings';
import type { WidgetTheme } from '@lifi/widget';

export const cookiesExpires = 3;

export const localStorageKey = {
  activeTab: 'activeTab',
  themeMode: 'themeMode',
  clientWallets: 'clientWallets',
  disabledFeatureCards: 'disabledFeatureCards',
};

interface DefaultSettingsType {
  themeMode: ThemeModesSupported;
  partnerTheme: WidgetTheme | undefined;
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  themeMode: 'auto',
  partnerTheme: undefined,
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
};
