import React from 'react';
import { DisconnectButtonBase } from './disconnect-button.styles';

type ConnectButtonProps = {
  children: any;
  onClick: () => any;
};

export const DisconnectButton = (props) => {
  return (
    <DisconnectButtonBase {...props}>{props.children}</DisconnectButtonBase>
  );
};
