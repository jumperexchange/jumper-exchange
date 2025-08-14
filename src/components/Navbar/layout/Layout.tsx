'use client';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import { WalletMenu } from 'src/components/Menus/WalletMenu';
import { WalletButtons } from '../components/Buttons/WalletButtons';

interface LayoutProps {
  hideConnectButton: boolean;
}

export const Layout = ({ hideConnectButton }: LayoutProps) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const secondaryButtons = !hideConnectButton && (
    <Box display="flex" flexDirection="row" gap={1}>
      {!hideConnectButton && <WalletButtons />}
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
