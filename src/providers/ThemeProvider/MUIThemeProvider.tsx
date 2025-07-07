'use client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { PropsWithChildren } from 'react';
import { themeCustomized } from 'src/theme/theme';

/**
 * App's theme provider component.
 * Provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function MUIThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider modeStorageKey="jumper-mode" theme={themeCustomized}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
