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
  partnerThemeUid?: string;
  clientWallets: string[];
  disabledFeatureCards: string[];
  welcomeScreenClosed: boolean;
}

export const defaultSettings: DefaultSettingsType = {
  themeMode: 'auto',
  partnerThemeUid: 'OP',
  clientWallets: [],
  disabledFeatureCards: [],
  welcomeScreenClosed: false,
};
