import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';

export type ActiveTheme = 'default' | string;

export interface ConfigThemeState {
  expirationDate: Date | undefined;
  isSelected: boolean;
}

export type ConfigThemeStates = Record<string, ConfigThemeState>;

export interface ThemeProps {
  partnerThemes: PartnerThemesData[];
  widgetTheme: { config: Partial<WidgetConfig> };
  configTheme: Partial<PartnerThemeConfig>;
  configThemeStates: ConfigThemeStates;
}

export interface ThemeActions {
  setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => void;
  setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => void;
  setConfigThemeState: (uid: string, state: Partial<ConfigThemeState>) => void;
  getConfigThemeState: (uid: string) => ConfigThemeState;
}

export type ThemeState = ThemeProps & ThemeActions;

export type PersistedThemeState = Pick<
  ThemeState,
  'configTheme' | 'widgetTheme' | 'configThemeStates'
>;

export type ThemeStore = UseBoundStoreWithEqualityFn<StoreApi<ThemeState>>;
