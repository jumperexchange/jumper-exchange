'use client';
import { LiFiExplorer } from '@lifi/explorer';
import type { PaletteMode } from '@mui/material';
import { alpha, Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { fallbackLng } from 'src/i18n';

// TODO: add new button in the wallet card in wallet menu that navigates to /scan/wallet/<address>
// TODO: Add button (jumper scan logo) that navigates to home screen of the explorer (/scan)

export default function Page({
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const theme = useTheme();

  const explorerConfig = useMemo(
    () => ({
      appearance: 'light' as PaletteMode, //theme.palette.mode, // This controls light and dark mode
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR, // TODO: change as needed
      base: '/', // Important for the routing and having everything served under /scan. Do not remove!
      theme: {
        // These colors and values correspond to the figma design
        shape: { borderRadiusSecondary: 900, borderRadius: 12 },
        palette: {
          background: {
            default: alpha(theme.palette.white.main, 0.8),
            paper: alpha(theme.palette.white.main, 0.8)
          },
        },
      },
    }),
    [lng, theme.palette.mode, theme.palette.white.main],
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
