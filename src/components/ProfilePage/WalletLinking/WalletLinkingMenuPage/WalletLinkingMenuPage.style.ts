'use client';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletLinkingHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const WalletLinkingContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
}));
