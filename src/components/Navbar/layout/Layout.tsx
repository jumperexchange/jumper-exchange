'use client';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

import { WalletMenu } from 'src/components/Menus/WalletMenu';
import { RedirectToApp } from '../components/Buttons/RedirectToApp';
import { WalletButtons } from '../components/Buttons/WalletButtons';

interface LayoutProps {
  hideConnectButton: boolean;
  isNotMainApp: boolean;
}

export const Layout = ({ hideConnectButton, isNotMainApp }: LayoutProps) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const secondaryButtons = (isNotMainApp || !hideConnectButton) && (
    <Box display="flex" flexDirection="row" gap={1}>
      {isNotMainApp && <RedirectToApp />}
      {!hideConnectButton && <WalletButtons />}
    </Box>
  );

  return (
    <>
      {isDesktop ? (
        <DesktopLayout
          hideMainLinks={isNotMainApp}
          secondaryButtons={secondaryButtons}
        />
      ) : (
        <MobileLayout
          hideMainLinks={isNotMainApp}
          secondaryButtons={secondaryButtons}
        />
      )}
      <WalletMenu />
    </>
  );
};
