import type { Breakpoint } from '@mui/material';
import { Box, Stack, Typography, styled } from '@mui/material';

export const AvailableMissionsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgSecondary.main,
  padding: theme.spacing(2),
  borderRadius: '12px',
  width: '90%',
  boxShadow: theme.shadows[1],
  [theme.breakpoints.down('md' as Breakpoint)]: {
    marginTop: '64px',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(2, 4, 0),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
    margin: theme.spacing(12, 4, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 4),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
}));

export const AvailableMissionsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
}));

export const AvailableMissionsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  color: 'inherit',
  margin: theme.spacing(3, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: 0,
  },
}));

export const AvailableMissionsStack = styled(Stack)(() => ({
  marginTop: 32,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}));
