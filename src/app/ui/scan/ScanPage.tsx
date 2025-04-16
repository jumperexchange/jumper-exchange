'use client';

import { ClientOnly } from '@/components/ClientOnly';
import { alpha, Box, type PaletteMode, useColorScheme, useTheme } from '@mui/material';
import { LiFiExplorer } from '@lifi/explorer';
import { useMemo } from 'react';
import { fallbackLng } from 'src/i18n';
import { JUMPER_SCAN_PATH } from '@/const/urls';

export default function ScanPage({ lng }: { lng: string }) {
  const theme = useTheme();
  const { mode } = useColorScheme();

  const explorerConfig = useMemo(
    () => ({
      appearance: 'light' as PaletteMode, // This controls light and dark mode
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR, // TODO: change as needed
      base: `${lng !== fallbackLng ? `${lng}` : ''}${JUMPER_SCAN_PATH}`, // Important for the routing and having everything served under /scan. Do not remove!
      theme: {
        // These colors and values correspond to the figma design
        shape: { borderRadiusSecondary: 900, borderRadius: 12 },
        palette: {
          background: {
            default: alpha(theme.palette.white.main, 0.8),
            paper: alpha(theme.palette.white.main, 0.8),
          },
        },
      },
    }),
    [lng, mode, theme.palette.white.main],
  );

  return (
    <ClientOnly>
      <Box
        sx={{
          p: 4,
          paddingBottom: 8,
        }}
      >
        <LiFiExplorer config={explorerConfig} />
      </Box>
    </ClientOnly>
  );
}
