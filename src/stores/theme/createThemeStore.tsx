import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
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
      }),
      {
        name: 'jumper-theme-store',
        version: 0,
        partialize: (state) => {
          return {
            themeMode: state.themeMode,
            activeTheme: state.activeTheme,
            configTheme: state.configTheme,
            widgetTheme: state.widgetTheme,
          };
        },
        merge: (persistedState, currentState) => {
          return {
            ...(persistedState as ThemeState),
            ...currentState,
          };
        },
      },
    ) as StateCreator<ThemeState, [], [], ThemeState>,
    Object.is,
  );
