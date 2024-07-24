// @mui

import type { ThemeModesSupported } from '@/types/settings';

export const cookiesExpires = 3;

export const localStorageKey = {
  activeTab: 'activeTab',
  themeMode: 'themeMode',
  clientWallets: 'clientWallets',
  disabledFeatureCards: 'disabledFeatureCards',
};

interface DefaultSettingsType {
  themeMode: ThemeModesSupported;
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  themeMode: 'system',
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
};
