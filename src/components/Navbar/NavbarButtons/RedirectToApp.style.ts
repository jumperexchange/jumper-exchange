'use client';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ConnectButton } from '../WalletButton.style';

export const RedirectAppButton = styled(ConnectButton)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: 48,
    minWidth: 48,
  },
}));

export const RedirectAppLabel = styled(Typography)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
}));

export const RedirectAppIcon = styled(SwapHorizIcon)(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));
