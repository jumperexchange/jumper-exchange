import { Box, Card } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';

export const BeraChainProgressCardComponent = styled(Card)(({ theme }) => ({
  display: 'none',
  flexDirection: 'row',
  backgroundColor: 'inherit',
  padding: theme.spacing(1.5, 3),
  flexGrow: 1,
  borderColor: alpha(theme.palette.black.main, 0.08),
  boxShadow: 'unset',
  alignItems: 'center',
  gap: '16px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
}));

export const BeraChainProgressCardContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BeraChainProgressCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
