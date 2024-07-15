'use client';
import { LiFiExplorer } from '@lifi/explorer';
import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';

// TODO: add new button in the wallet card in wallet menu that navigates to /scan/wallet/<address>
// TODO: Add button (jumper scan logo) that navigates to home screen of the explorer (/scan)

export default function Page() {
  const theme = useTheme();

  const explorerConfig = useMemo(
    () => ({
      appearance: theme.palette.mode, // This controls light and dark mode
      integrator: 'jumper.exchange', // TODO: change as needed
      base: '/scan', // Important for the routing and having everything served under /scan. Do not remove!
      theme: {
        // These colors and values correspond to the figma design
        shape: { borderRadiusSecondary: 900, borderRadius: 12 },
        palette: {
          background: {
            default: '#F9F5FF',
            secondary: 'rgba(0, 0, 0, 0.04)',
            paper: '#fff',
          },
        },
      },
    }),
    [theme],
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
