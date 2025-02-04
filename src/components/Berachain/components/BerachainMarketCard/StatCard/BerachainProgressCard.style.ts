import { Box, Card } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const BeraChainProgressCardComponent = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#1E1D1C',
  padding: theme.spacing(1.5, 3),
  flexGrow: 1,
  borderColor: alpha(theme.palette.black.main, 0.08),
  boxShadow: 'unset',
  alignItems: 'center',
  gap: '16px',
  height: 'auto',
}));

export const BeraChainProgressCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}));

export const BeraChainProgressCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
