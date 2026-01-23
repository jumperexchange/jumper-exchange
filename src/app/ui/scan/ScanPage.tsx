'use client';

import { ClientOnly } from '@/components/ClientOnly';
import config from '@/config/env-config';
import { JUMPER_SCAN_PATH } from '@/const/urls';
import getApiUrl from '@/utils/getApiUrl';
import { LiFiExplorer, type LiFiExplorerConfig } from '@lifi/explorer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { fallbackLng } from 'src/i18n';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export default function ScanPage({ lng }: { lng: string }) {
  const theme = useTheme();

  const defaultSuccessPalette = useMemo(
    () => ({
      success: {
        main: '#d6ffe7',
        dark: '#00b849',
      },
      warning: {
        main: '#FFCC00',
        dark: '#000000',
      },
    }),
    [],
  );

  const explorerConfig = useMemo(
    () =>
      ({
        apiUrl: getApiUrl(),
        // appearance: 'light' as PaletteMode, // This controls light and dark mode
        integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR, // TODO: change as needed
        base: `${lng !== fallbackLng ? `${lng}` : ''}${JUMPER_SCAN_PATH}`, // Important for the routing and having everything served under /scan. Do not remove!
        theme: {
          // These colors and values correspond to the figma design
          shape: {
            borderRadiusSecondary: (theme.vars || theme).shape
              .scanBorderRadiusSecondary,
            borderRadiusTertiary: (theme.vars || theme).shape
              .scanBorderRadiusTertiary,
            borderRadius: (theme.vars || theme).shape.scanBorderRadius,
          },
          colorSchemes: {
            light: {
              palette: {
                ...theme.colorSchemes.light?.palette,
                ...defaultSuccessPalette,
              },
            },
            dark: {
              palette: {
                ...theme.colorSchemes.dark?.palette,
                ...defaultSuccessPalette,
              },
            },
          },
        },
      }) as LiFiExplorerConfig,
    [lng, theme.colorSchemes, defaultSuccessPalette],
  );

  return (
    <ClientOnly>
      <Box
        sx={{
          p: 4,
          paddingBottom: {
            xs: 12,
            md: 8,
          },
          '& .MuiPaper-root': {
            backgroundImage: 'none',
          },
        }}
      >
        <FetchInterceptorProvider />
        <LiFiExplorer config={explorerConfig} />
      </Box>
    </ClientOnly>
  );
}
