import { ExtendedChain } from '@lifi/types';
import { Avatar, Typography } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import React, { ReactElement, useMemo } from 'react';
import { ConnectButton } from '../../atoms/connect-button';
import { DisconnectButton } from '../../atoms/disconnect-button';
import { MenuContextProps } from '../../types';
interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  setOpenNavbarSubmenu?: (subMenu: string) => void;
  color?: string;
  menu: MenuContextProps;
  connectButtonLabel?: ReactElement<any, any>;
  activeChain?: ExtendedChain;
  hoverBackgroundColor?: string;
  isSuccess: boolean;
  walletManagement: any;
}

export const walletDigest = (account) => {
  if (!!account.address) {
    return `${account.address.substr(0, 5)}...${account.address.substr(-4)}`;
  } else {
    return 'None';
  }
};

export const WalletManagementButtons: React.FC<WalletManagementButtonsProps> = (
  props,
) => {
  const { account } = props.walletManagement;
  const settings = useSettings();
  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const handleWalletPicker = () => {
    props.menu.onOpenNavbarWalletMenu(!props.menu.openNavbarWalletMenu);
  };

  const handleWalletMenuClick = () => {
    props.menu.onOpenNavbarConnectedMenu(!props.menu.openNavbarConnectedMenu);
  };

  return (
    <>
      {!account.address ? (
        <>
          <ConnectButton
            onClick={handleWalletPicker}
            backgroundColor={props.backgroundColor}
            hoverBackgroundColor={props.hoverBackgroundColor}
            color={props.color}
          >
            {!!props.connectButtonLabel
              ? props.connectButtonLabel
              : 'Connect Wallet'}
          </ConnectButton>
        </>
      ) : (
        <DisconnectButton
          onClick={handleWalletMenuClick}
          backgroundColor={props.backgroundColor}
          hoverBackgroundColor={props.hoverBackgroundColor}
          color={!account.isActive ? 'white' : props.color}
        >
          {!!props.isSuccess ? (
            <Avatar
              className="menu-item-label__icon"
              src={!!props.activeChain ? props.activeChain.logoURI : 'empty'}
              alt={`${
                !!props?.activeChain?.name ? props.activeChain.name : ''
              }chain-logo`}
              sx={{ height: '32px', width: '32px', mr: '12px' }}
            />
          ) : (
            <></>
          )}
          <Typography variant={'lifiBodyMediumStrong'} width={'100%'}>
            <>{_walletDigest}</>
          </Typography>
        </DisconnectButton>
      )}
    </>
  );
};
