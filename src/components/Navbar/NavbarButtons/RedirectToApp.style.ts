'use client';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));
