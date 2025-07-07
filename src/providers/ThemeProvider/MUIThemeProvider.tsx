'use client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { themeCustomized } from 'src/theme/theme';
import { PropsWithChildren } from 'react';

/**
 * App's theme provider component.
 * Provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function MUIThemeProvider({ children }: PropsWithChildren) {
  return (
    <>
      <CssBaseline enableColorScheme />
      <ThemeProvider modeStorageKey="jumper-mode" theme={themeCustomized}>
        {children}
      </ThemeProvider>
    </>
  );
}
