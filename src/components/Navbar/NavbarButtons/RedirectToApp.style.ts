'use client';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RedirectAppLabel = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));
