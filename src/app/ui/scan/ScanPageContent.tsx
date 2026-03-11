'use client';

import { ClientOnly } from '@/components/ClientOnly';
import config from '@/config/env-config';
import { JUMPER_SCAN_PATH } from '@/const/urls';
import getApiUrl from '@/utils/getApiUrl';
import { LiFiExplorer, type LiFiExplorerConfig } from '@lifi/explorer';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useMemo, useRef } from 'react';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { usePathname } from 'next/navigation';

export default function ScanPageContent({ lng }: { lng: string }) {
  const theme = useTheme();
  const pathname = usePathname();
  const basePath = pathname.split(JUMPER_SCAN_PATH)[0];

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
  const configRef = useRef<LiFiExplorerConfig | null>(null);
  if (!configRef.current) {
    configRef.current = {
      apiUrl: getApiUrl(),
      // appearance: 'light' as PaletteMode, // This controls light and dark mode
      integrator: config.NEXT_PUBLIC_WIDGET_INTEGRATOR, // TODO: change as needed
      base: `${basePath}${JUMPER_SCAN_PATH}`, // Important for the routing and having everything served under /scan. Do not remove!
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
    } as LiFiExplorerConfig;
  }

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
            border: getSurfaceBorder(theme, 'surface2'),
          },
          '& .MuiList-root > .MuiGrid-root.MuiGrid-container': {
            border: getSurfaceBorder(theme, 'surface1'),
          },
        }}
      >
        <LiFiExplorer config={configRef.current} />
      </Box>
    </ClientOnly>
  );
}
