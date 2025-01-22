import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export const WithdrawWidgetBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  gap: '16px',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    minWidth: 416,
    maxWidth: 'unset',
  },
}));
