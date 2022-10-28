import React from 'react';
import { WalletIcon } from '../icons';
import { ConnectButtonBase } from './connect-button.styles';

type ConnectButtonProps = {
  children: any;
  onClick: () => any;
};

export const ConnectButton = (props) => {
  return (
    <ConnectButtonBase {...props} endIcon={<WalletIcon />}>
      {props.children}
    </ConnectButtonBase>
  );
};
