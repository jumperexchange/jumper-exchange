import React from 'react';
import { WalletIcon } from '../icons';
import { DisconnectButtonBase } from './disconnect-button.styles';

type ConnectButtonProps = {
  children: any;
  onClick: () => any;
};

export const DisconnectButton = (props) => {
  return (
    <DisconnectButtonBase {...props} endIcon={<WalletIcon />}>
      {props.children}
    </DisconnectButtonBase>
  );
};
