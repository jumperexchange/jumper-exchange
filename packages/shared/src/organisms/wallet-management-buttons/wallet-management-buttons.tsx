import { supportedWallets } from '@lifi/wallet-management';
import React, { useMemo, useState } from 'react';
import { ConnectButton } from '../../atoms/connect-button';
import { DisconnectButton } from '../../atoms/disconnect-button';
import { WalletIcon } from '../../atoms/icons';
import { WalletModal } from '../../molecules/wallet-modal/wallet-modal';

interface WalletManagementButtonsProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  walletManagement: () => any;
}

export const WalletManagementButtons: React.FC<any> = (props) => {
  const { account, disconnect } = props.walletManagement;

  const [showModal, setShowModal] = useState(false);

  const walletDigest = useMemo(() => {
    if (account.address) {
      return `${account.address.substr(0, 4)}...`;
    } else {
      return '';
    }
  }, [account.address]);

  const handleClick = () => {
    setShowModal((oldState) => !oldState);
  };

  return (
    <>
      {!account.address ? (
        <ConnectButton
          onClick={handleClick}
          backgroundColor={props.backgroundColor}
          hoverBackgroundColor={props.hoverBackgroundColor}
        >
          Connect Wallet
        </ConnectButton>
      ) : (
        <DisconnectButton onClick={disconnect} endIcon={<WalletIcon />}>
          Disconnect {walletDigest}
        </DisconnectButton>
      )}

      <WalletModal
        open={showModal}
        handleClose={handleClick}
        wallets={supportedWallets}
        walletManagement={props.walletManagement}
      />
    </>
  );
};
