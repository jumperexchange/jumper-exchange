import { Box, Breakpoint, styled, IconButton } from '@mui/material';

export const WithdrawWidgetBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    minWidth: 316,
    maxWidth: 316,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    minWidth: 416,
    maxWidth: 416,
  },
}));
