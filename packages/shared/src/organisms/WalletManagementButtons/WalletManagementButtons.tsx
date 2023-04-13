import { wallets } from '@lifi/wallet-management';
import type { Breakpoint } from '@mui/material';
import { Avatar, Typography, useTheme } from '@mui/material';
import type { TWallets } from '@transferto/dapp/src/types';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import {
  TrackingActions,
  TrackingCategories,
} from '../../../../dapp/src/const';
import { EventTrackingTools } from '../../../../dapp/src/hooks';
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
    !props.menu.openNavbarWalletSelectMenu &&
      trackEvent({
        category: 'menu',
        action: 'open-wallet-menu',
        disableTrackingTool: [EventTrackingTools.arcx],
      });
    props.menu.onOpenNavbarWalletSelectMenu(
      !props.menu.openNavbarWalletSelectMenu,
    );
  };

  const handleConnectedMenuClick = () => {
    !props.menu.openNavbarWalletMenu &&
      trackEvent({
        category: TrackingCategories.MENU,
        action: TrackingActions.OPEN_CONNECTED_MENU,
        disableTrackingTool: [EventTrackingTools.arcx],
      });
    props.menu.onOpenNavbarWalletMenu(!props.menu.openNavbarWalletMenu);
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
        // ConnectedMenu-Button -->
        <ButtonSecondary
          sx={{
            width: '180px',
            padding: '6px 8px',
            paddingRight: '16px',
            minWidth: 'inherit',
            '@media screen and (min-width:430px) and (max-width: 900px)': {
              width: '180px',
              padding: '6px 8px',
            },
            [theme.breakpoints.up('md' as Breakpoint)]: {
              position: 'relative',
              width: '48px', //'180px',
              padding: '0',
              left: 'unset',
              display: 'inherit',
              transform: 'unset',
            },
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              width: '180px',
              padding: '6px',
            },
          }}
          onClick={handleConnectedMenuClick}
        >
          {!!props.isSuccess ? (
            <Avatar
              src={walletIcon}
              // alt={`${!!usedWallet.name ? usedWallet.name : ''}wallet-logo`}
              sx={{
                padding: theme.spacing(1.5),
                background:
                  theme.palette.mode === 'light'
                    ? theme.palette.black.main
                    : theme.palette.white.main,
                height: '32px',
                width: '32px',
              }}
            />
          ) : null}
          <Typography
            variant={'lifiBodyMediumStrong'}
            width={'100%'}
            sx={{
              [theme.breakpoints.up('md' as Breakpoint)]: {
                display: 'none',
              },
              [theme.breakpoints.up('lg' as Breakpoint)]: {
                display: 'block',
              },
            }}
          >
            {_walletDigest}
          </Typography>
        </ButtonSecondary>
      )}
    </>
  );
};
