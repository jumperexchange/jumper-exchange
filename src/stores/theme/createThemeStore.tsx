import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type { ThemeMode, ThemeProps, ThemeState } from '@/types/theme';
import type { WidgetConfig } from '@lifi/widget';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export const createThemeStore = (props: ThemeProps) =>
  createWithEqualityFn<ThemeState>(
    persist(
      (set, get) => ({
        ...props,
        setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => {
          set({
            configTheme,
          });
        },
        setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => {
          set({
            widgetTheme,
          });
        },
        setThemeMode: (mode: ThemeMode) => {
          set({
            themeMode: mode,
          });
        },
        setPartnerThemes: (partnerThemes: PartnerThemesData[]) => {
          set({
            partnerThemes,
          });
        },
      }),
      {
        name: 'jumper-theme-store',
        version: 0,
      },
    ) as StateCreator<ThemeState, [], [], ThemeState>,
    Object.is,
  );
