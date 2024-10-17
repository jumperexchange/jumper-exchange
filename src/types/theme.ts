import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export const ThemeModes = ['light', 'dark', 'system'] as const;

export type ThemeMode = (typeof ThemeModes)[number];

export type ActiveTheme = 'default' | string;

export interface ThemeProps {
  partnerThemes: PartnerThemesData[];
  activeTheme: ActiveTheme;
  widgetTheme: { config: Partial<WidgetConfig> };
  configTheme: Partial<PartnerThemeConfig>;
  themeMode: ThemeMode;
}

export interface ThemeActions {
  setThemeMode: (mode: ThemeMode) => void;
  setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => void;
  setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => void;
  setPartnerThemes: (themes: PartnerThemesData[]) => void;
}

export type ThemeState = ThemeProps & ThemeActions;

export type ThemeStore = UseBoundStoreWithEqualityFn<StoreApi<ThemeState>>;
