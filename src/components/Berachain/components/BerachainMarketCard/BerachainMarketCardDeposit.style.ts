import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const BerachainMarketCardDepositBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  color: theme.palette.text.secondary,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: '12px',
  background: alpha('#FDB72D', 0.2),
}));

export const BerachainMarketCardDepositToken = styled(Typography)(
  ({ theme }) => ({
    color: theme.palette.white.main,
  }),
);

export const BerachainMarketCardDepositInfo = styled(Box)(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.84),
}));
