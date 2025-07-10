import { Box, Step, StepButton, Typography, styled } from '@mui/material';

export const WalletHackedStepBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const WalletHackedStepImage = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: theme.palette.white.main,
  padding: theme.spacing(1),
}));

export const WalletHackedStepText = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'center',
  wordBreak: 'break-word',
}));

export const WalletHackedStepButton = styled(StepButton)(({ theme }) => ({
  padding: 0,
}));

export const WalletHackedStep = styled(Step)(({ theme }) => ({
  height: 'auto',
}));
