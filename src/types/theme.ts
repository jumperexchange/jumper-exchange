import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type { WidgetConfig } from '@lifi/widget';
import type { StoreApi } from 'zustand';
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import type { CreateJumperThemeOptions } from 'src/theme/theme';

export type ActiveTheme = 'default' | string;

export interface ConfigThemeState {
  expirationDate: Date | undefined;
  isSelected: boolean;
}

export type ConfigThemeStates = Record<string, ConfigThemeState>;

// Single widget theme config
export interface WidgetThemeConfig {
  config: Partial<WidgetConfig>;
}

// All pre-computed widget theme variants
export interface WidgetThemeVariants {
  light: WidgetThemeConfig;
  dark: WidgetThemeConfig;
  partnerLight: WidgetThemeConfig;
  partnerDark: WidgetThemeConfig;
}

// All pre-computed jumper theme variants
export interface JumperThemeVariants {
  default: CreateJumperThemeOptions;
  partner: CreateJumperThemeOptions;
}

export interface ThemeProps {
  partnerThemes: PartnerThemesData[];
  widgetTheme: WidgetThemeVariants;
  jumperTheme: JumperThemeVariants;
  configTheme: Partial<PartnerThemeConfig>;
  configThemeStates: ConfigThemeStates;
}

export interface ThemeActions {
  setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => void;
  setWidgetTheme: (widgetTheme: WidgetThemeVariants) => void;
  setJumperTheme: (jumperTheme: JumperThemeVariants) => void;
  setConfigThemeState: (uid: string, state: Partial<ConfigThemeState>) => void;
  getConfigThemeState: (uid: string) => ConfigThemeState;
}

export type ThemeState = ThemeProps & ThemeActions;

export type PersistedThemeState = Pick<
  ThemeState,
  'configTheme' | 'widgetTheme' | 'jumperTheme' | 'configThemeStates'
>;

export type ThemeStore = UseBoundStoreWithEqualityFn<StoreApi<ThemeState>>;
