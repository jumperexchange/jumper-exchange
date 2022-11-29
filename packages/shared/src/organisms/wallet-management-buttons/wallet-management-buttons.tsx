import { ExtendedChain } from '@lifi/types';
import { supportedWallets } from '@lifi/wallet-management';
import { Avatar, Typography } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ConnectButton } from '../../atoms/connect-button';
import { DisconnectButton } from '../../atoms/disconnect-button';
import { WalletModal } from '../../molecules/wallet-modal/wallet-modal';
interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  activeChain?: ExtendedChain;
  hoverBackgroundColor?: string;
  isSuccess: boolean;
  walletManagement: any;
  openWalletMenu?: boolean;
  setOpenWalletMenu?: Dispatch<SetStateAction<boolean>>;
  openWalletSubMenu?: string;
  setOpenWalletSubMenu?: Dispatch<SetStateAction<string>>;
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
  const [showModal, setShowModal] = useState(false);
  const _walletDigest = useMemo(() => {
    return walletDigest(account);
  }, [account]);

  const handleClick = () => {
    setShowModal((oldState) => !oldState);
  };

  const handleWalletMenuClick = () => {
    props.setOpenWalletMenu(!props.openWalletMenu);
  };

  return (
    <>
      {!account.address ? (
        <ConnectButton
          onClick={handleClick}
          backgroundColor={props.backgroundColor}
          hoverBackgroundColor={props.hoverBackgroundColor}
          color={props.color}
        >
          Connect Wallet
        </ConnectButton>
      ) : (
        <DisconnectButton onClick={handleWalletMenuClick}>
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
          <Typography
            fontSize={'14px'}
            fontWeight={700}
            lineHeight={'20px'}
            width={'100%'}
          >
            <>{_walletDigest}</>
          </Typography>
        </DisconnectButton>
      )}

      <WalletModal
        open={showModal}
        handleClose={handleClick}
        setOpen={setShowModal}
        wallets={supportedWallets}
        walletManagement={props.walletManagement}
      />
    </>
  );
};
