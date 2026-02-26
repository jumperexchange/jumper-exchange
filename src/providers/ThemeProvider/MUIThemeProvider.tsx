'use client';
import type { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import { createJumperTheme } from 'src/theme/theme';
import { useThemeStore } from 'src/stores/theme';
import { useThemeConditionsMet } from 'src/hooks/theme/useThemeConditionsMet';
import {
  THEME_COLOR_SCHEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from './constants';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * App's theme provider component.
 * Provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function MUIThemeProvider({ children }: PropsWithChildren) {
  const jumperTheme = useThemeStore((state) => state.jumperTheme);
  const { shouldShowForTheme } = useThemeConditionsMet();
  const defaultThemeRef = useRef<Theme>(null);
  const partnerThemeRef = useRef<Theme>(null);

  if (!defaultThemeRef.current) {
    defaultThemeRef.current = createJumperTheme(jumperTheme.default);
  }
  if (!partnerThemeRef.current) {
    partnerThemeRef.current = createJumperTheme(jumperTheme.partner);
  }

  const theme = shouldShowForTheme
    ? partnerThemeRef.current
    : defaultThemeRef.current;

  return (
    <ThemeProvider
      theme={theme}
      modeStorageKey={THEME_MODE_STORAGE_KEY}
      colorSchemeStorageKey={THEME_COLOR_SCHEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
