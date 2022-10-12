import { Avatar, Grid, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { WalletAvatar, WalletGridItem } from './wallet-card.styles';

type WalletCardProps = {
  src: string;
  title: string;
  onClick?: any;
};
export const WalletCard: React.FC<WalletCardProps> = (props) => {
  return (
    <>
      <WalletGridItem
        onClick={props.onClick}
        item
        alignContent={'center'}
        alignItems={'center'}
        m={4}
      >
        <WalletAvatar
          src={props.src}
          // alt={`${props.title.split(' ')[0][0]}${props.title.split(' ')[1][0]}`}
        />
        <Typography>{props.title}</Typography>
      </WalletGridItem>
    </>
  );
};
