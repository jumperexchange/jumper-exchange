import { Dialog, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletDialog = styled(Dialog)(({ theme }) => ({
  background: theme.palette.background.default,
  margin: '0 auto',
  overflowY: 'scroll',
}));

export const WalletCardGrid = styled(Grid)(({ theme }) => ({
  margin: '0 auto',
}));
