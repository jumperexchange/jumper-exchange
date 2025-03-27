import { Box, styled, Typography } from '@mui/material';
import Image from 'next/image';

export const WalletLinkingStepBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
}));

export const WalletLinkingStepText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm')]: {
    whiteSpace: 'nowrap',
  },
}));

export const WalletLinkingStepImage = styled(Image)(({ theme }) => ({
  borderRadius: '100%',
  border: `2px solid ${theme.palette.white.main}`,
}));
