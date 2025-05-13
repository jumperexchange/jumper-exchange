'use client';
import { ThemeStoreProvider } from '@/stores/theme';
import type { ThemeProps } from '@/types/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { CssBaseline, useColorScheme, useMediaQuery } from '@mui/material';
import { useEffect, useMemo } from 'react';
import type { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import { ThemeProviderBase } from './ThemeProviderBase';
import type { ThemeProviderProps } from './types';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { themeCustomized } from 'src/theme/theme';

/**
 * App's theme provider component.
 * Provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function ThemeProvider({ children, themes }: ThemeProviderProps) {
  return (
    <>
      <CssBaseline enableColorScheme />
      <MuiThemeProvider modeStorageKey="jumper-mode" theme={themeCustomized}>
        <ThemeProviderBase themes={themes}>{children}</ThemeProviderBase>
      </MuiThemeProvider>
    </>
  );
}
