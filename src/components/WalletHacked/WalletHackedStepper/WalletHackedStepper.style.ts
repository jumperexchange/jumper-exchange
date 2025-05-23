import { Box, Typography, styled } from '@mui/material';

export const WalletHackedStepBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  minWidth: 200,
}));

export const WalletHackedStepImage = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: theme.palette.white.main,
  padding: theme.spacing(1),
}));

export const WalletHackedStepText = styled(Typography)(({ theme }) => ({
  color: theme.palette.white.main,
  textAlign: 'center',
  wordBreak: 'break-word',
}));
