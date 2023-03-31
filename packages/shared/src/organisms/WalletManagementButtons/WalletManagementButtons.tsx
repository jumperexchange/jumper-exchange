import type { ExtendedChain } from '@lifi/types';
import type { Breakpoint } from '@mui/material';
import { Avatar, Typography, useTheme } from '@mui/material';
import type { ReactElement } from 'react';
import React from 'react';
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
  activeChain?: ExtendedChain;
  isSuccess: boolean;
  walletManagement: any;
}

export const WalletManagementButtons: React.FC<WalletManagementButtonsProps> = (
  props,
) => {
  const { account } = props.walletManagement;
  const _walletDigest = walletDigest(account);
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const handleWalletPicker = () => {
    props.menu.onOpenNavbarWalletMenu(!props.menu.openNavbarWalletMenu);
  };

  const handleWalletMenuClick = () => {
    !props.menu.openNavbarConnectedMenu &&
      trackEvent({
        category: 'menu',
        action: 'open-connected-menu',
        disableTrackingTool: [EventTrackingTools.arcx],
      });
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
              src={!!props.activeChain ? props.activeChain.logoURI : 'empty'}
              alt={`${
                !!props?.activeChain?.name ? props.activeChain.name : ''
              }chain-logo`}
              sx={{ height: '32px', width: '32px', mr: theme.spacing(3) }}
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
