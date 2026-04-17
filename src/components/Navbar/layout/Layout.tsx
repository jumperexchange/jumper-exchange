'use client';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { WalletButtons } from '../components/Buttons/WalletButtons';
import dynamic from 'next/dynamic';

const WalletMenu = dynamic(
  () => import('src/components/Menus/WalletMenu').then((mod) => mod.WalletMenu),
  { ssr: false },
);

const DesktopLayout = dynamic(
  () => import('./DesktopLayout').then((mod) => mod.DesktopLayout),
  { ssr: false },
);

const MobileLayout = dynamic(
  () => import('./MobileLayout').then((mod) => mod.MobileLayout),
  { ssr: false },
);

export const Layout = () => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const secondaryButtons = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
      }}
    >
      <WalletButtons />
    </Box>
  );

  return (
    <>
      {isDesktop ? (
        <DesktopLayout secondaryButtons={secondaryButtons} />
      ) : (
        <MobileLayout secondaryButtons={secondaryButtons} />
      )}
      <WalletMenu />
    </>
  );
};
