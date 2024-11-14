import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const BerachainOverviewBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  // alignItems: 'center',
  marginTop: theme.spacing(20),
  justifyContent: 'space-between',
}));

export const BerachainProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
export const BerachainOverviewHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const BerachainOverviewSubtitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.5),
}));
