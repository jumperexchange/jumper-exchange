import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type ActiveTheme = 'default' | string;

export interface ThemeProps {
  partnerThemes: PartnerThemesData[];
  activeTheme: ActiveTheme;
  widgetTheme: { config: Partial<WidgetConfig> };
  configTheme: Partial<PartnerThemeConfig>;
}

export interface ThemeActions {
  setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => void;
  setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => void;
}

export type ThemeState = ThemeProps & ThemeActions;

export type ThemeStore = UseBoundStoreWithEqualityFn<StoreApi<ThemeState>>;
