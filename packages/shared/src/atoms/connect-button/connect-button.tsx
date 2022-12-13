import React from 'react';
import { WalletIcon } from '../icons';
import { ConnectButtonBase } from './connect-button.styles';

export const ConnectButton = (props) => {
  return (
    <ConnectButtonBase {...props} endIcon={<WalletIcon />}>
      {props.children}
    </ConnectButtonBase>
  );
};
