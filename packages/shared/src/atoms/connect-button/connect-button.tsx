import React from 'react';
import { ConnectButtonBase } from './connect-button.styles';

export const ConnectButton = (props) => {
  return <ConnectButtonBase {...props}>{props.children}</ConnectButtonBase>;
};
