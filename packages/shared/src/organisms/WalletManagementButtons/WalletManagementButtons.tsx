import type { ExtendedChain } from '@lifi/types';
import { wallets } from '@lifi/wallet-management';
import type { Breakpoint } from '@mui/material';
import { Avatar, Typography, useTheme } from '@mui/material';
import type { TWallets } from '@transferto/dapp/src/types';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { useUserTracking } from '../../../../dapp/src/hooks/useUserTracking/useUserTracking';
import { ButtonPrimary } from '../../atoms/ButtonPrimary';
import { ButtonSecondary } from '../../atoms/ButtonSecondary';
import type { MenuContextProps } from '../../types';
import { walletDigest } from '../../utils/walletDigest';
interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  setOpenNavbarSubmenu?: (subMenu: string) => void;
  color?: string;
  walletConnected?: boolean;
  menu: MenuContextProps;
  connectButtonLabel?: ReactElement<any, any>;
  activeChain?: ExtendedChain;
  isSuccess: boolean;
  walletManagement: any;
}

export const WalletManagementButtons: React.FC<WalletManagementButtonsProps> = (
  props,
) => {
  const { account, usedWallet } = props.walletManagement;
  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const walletSource: TWallets = wallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      const walletKey: any = Object.keys(walletSource).filter(
        (el) => walletSource[el].name === localStorage.activeWalletName,
      );
      return walletSource[walletKey]?.icon || '';
    }
  }, [usedWallet, walletSource]);

  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const handleWalletPicker = () => {
    props.menu.onOpenNavbarWalletMenu(!props.menu.openNavbarWalletMenu);
  };

  const handleWalletMenuClick = () => {
    !props.menu.openNavbarConnectedMenu &&
      trackEvent({ category: 'menu', action: 'open-connected-menu' });
    props.menu.onOpenNavbarConnectedMenu(!props.menu.openNavbarConnectedMenu);
  };

  return (
    <>
      {!account.address ? (
        // Connect-Button -->
        <>
          <ButtonPrimary
            onClick={handleWalletPicker}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                width: '169px',
                display: 'inline-flex !important',
              },
            })}
          >
            {!!props.connectButtonLabel
              ? props.connectButtonLabel
              : 'Connect Wallet'}
          </ButtonPrimary>
        </>
      ) : (
        // WalletMenu-Button -->
        <ButtonSecondary
          sx={{
            width: '180px',
            paddingRight: '16px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            [theme.breakpoints.up('md' as Breakpoint)]: {
              position: 'relative',
              left: 'unset',
              display: 'inherit',
              transform: 'unset',
            },
          }}
          onClick={handleWalletMenuClick}
        >
          {!!props.isSuccess ? (
            <Avatar
              src={walletIcon}
              // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
              sx={{
                height: '32px',
                width: '32px',
              }}
            />
          ) : (
            <></>
          )}
          <Typography variant={'lifiBodyMediumStrong'} width={'100%'}>
            <>{_walletDigest}</>
          </Typography>
        </ButtonSecondary>
      )}
    </>
  );
};
