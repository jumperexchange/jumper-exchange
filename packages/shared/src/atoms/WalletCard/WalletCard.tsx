import { Typography } from '@mui/material';
import React from 'react';
import { WalletAvatar, WalletItem } from './WalletCard.style';

type WalletCardProps = {
  src: string;
  title: string;
  onClick?: any;
};
export const WalletCard: React.FC<WalletCardProps> = (props) => {
  return (
    <>
      <WalletItem onClick={props.onClick}>
        <WalletAvatar
          src={props.src}
          // alt={`${props.title.split(' ')[0][0]}${props.title.split(' ')[1][0]}`}
        />
        <Typography>{props.title}</Typography>
      </WalletItem>
    </>
  );
};
