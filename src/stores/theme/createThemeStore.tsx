import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { ThemeMode, ThemeProps, ThemeState } from '@/types/theme';
import type { WidgetConfig } from '@lifi/widget';
import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import Cookies from 'universal-cookie';
import { cookieName } from 'src/i18n';

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
        setActiveTheme: (theme: string) => {
          set({
            activeTheme: theme,
          });
        },
      }),
      {
        name: 'jumper-theme-store',
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            const cookies = new Cookies();
            const theme = cookies.get('theme')
            const themeMode = cookies.get('themeMode')
            const newStore = { ...persistedState };

            if (theme) {
              newStore.activeTheme = theme;
              cookies.remove('theme', { path: '/', sameSite: true })
            }

            if (themeMode) {
              newStore.themeMode = themeMode;
              cookies.remove('themeMode', { path: '/', sameSite: true })
            }

            console.debug('theme/themeMode cookies migrated');

            return newStore;
          }
          return persistedState;
        },
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
