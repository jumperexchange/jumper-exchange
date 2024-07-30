'use client';
import { LiFiExplorer } from '@lifi/explorer';
import { alpha, Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { fallbackLng } from 'src/i18n';

// TODO: add new button in the wallet card in wallet menu that navigates to /scan/wallet/<address>
// TODO: Add button (jumper scan logo) that navigates to home screen of the explorer (/scan)

export default function Page({
  params: { lng, wallet },
}: {
  children: React.ReactNode;
  params: { lng: string; wallet: string };
}) {
  const theme = useTheme();
  const explorerConfig = useMemo(
    () => ({
      appearance: theme.palette.mode, // This controls light and dark mode
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR, // TODO: change as needed
      base: lng !== fallbackLng ? `${lng}/scan/wallet` : `/scan/wallet`, // Important for the routing and having everything served under /scan. Do not remove!
      theme: {
        // These colors and values correspond to the figma design
        shape: { borderRadiusSecondary: 900, borderRadius: 12 },
        palette: {
          background: {
            default:
              theme.palette.mode === 'light'
                ? alpha(theme.palette.white.main, 0.8)
                : alpha(theme.palette.white.main, 0.2),
            paper:
              theme.palette.mode === 'light'
                ? alpha(theme.palette.white.main, 0.8)
                : alpha(theme.palette.white.main, 0.2),
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
