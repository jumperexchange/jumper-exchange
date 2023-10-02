import { supportedWallets } from '@lifi/wallet-management';
import type { Breakpoint } from '@mui/material';
import { Avatar, Typography, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { ButtonPrimary, ButtonSecondary } from 'src/atoms';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { walletDigest } from 'src/utils';

interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  walletConnected?: boolean;
  connectButtonLabel?: ReactElement<any, any>;
  isSuccess: boolean;
  walletManagement: any;
}

export const WalletManagementButtons: React.FC<
  WalletManagementButtonsProps
> = ({ walletManagement, connectButtonLabel, isSuccess }) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const { account, usedWallet } = walletManagement;
  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const [
    openWalletSelectPopper,
    onOpenWalletSelectPopper,
    openWalletPopper,
    onOpenWalletPopper,
  ] = useMenuStore((state) => [
    state.openWalletSelectPopper,
    state.onOpenWalletSelectPopper,
    state.openWalletPopper,
    state.onOpenWalletPopper,
  ]);

  const walletSource = supportedWallets;
  const walletIcon: string = useMemo(() => {
    if (!!usedWallet) {
      return usedWallet.icon;
    } else {
      for (const key in Object.keys(walletSource)) {
        if (walletSource.hasOwnProperty(key)) {
          let value = walletSource[key];
          if (value.name === localStorage.activeWalletName) {
            return value.icon;
          }
          //do something with value;
        }
      }
    }
  }, [usedWallet, walletSource]);

  const handleWalletSelectClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    openWalletSelectPopper &&
      trackEvent({
        category: TrackingCategory.WalletSelectMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_wallet_select_menu',
        data: { [TrackingEventParameter.Menu]: 'wallet_select_menu' },
        disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
      });
    onOpenWalletSelectPopper(!openWalletSelectPopper, event.currentTarget);
  };

  const handleWalletMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    openWalletPopper &&
      trackEvent({
        category: TrackingCategory.WalletMenu,
        action: TrackingAction.OpenMenu,
        label: 'open_wallet_menu',
        data: { [TrackingEventParameter.Menu]: 'wallet_menu' },
        disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
      });
    onOpenWalletPopper(!openWalletPopper, event.currentTarget);
  };

  return !account.address ? (
    // Connect/WalletSelect-Button -->
    <ButtonPrimary
      // Used in the widget
      id="connect-wallet-button"
      onClick={handleWalletSelectClick}
      sx={(theme) => ({
        display: 'none',
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          width: '169px',
          display: 'inline-flex !important',
        },
      })}
    >
      {connectButtonLabel}
    </ButtonPrimary>
  ) : (
    // Wallet-Menu-Button -->
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
          width: '48px',
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
      onClick={handleWalletMenuClick}
    >
      {isSuccess ? (
        <Avatar
          src={walletIcon}
          sx={{
            padding: theme.spacing(0.75),
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
  );
};
