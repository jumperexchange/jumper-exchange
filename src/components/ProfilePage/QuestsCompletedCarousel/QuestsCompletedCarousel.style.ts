import type { Breakpoint } from '@mui/material';
import { Box, Stack, Typography, alpha, styled } from '@mui/material';

export const CompletedQuestContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    alpha(theme.palette.white.main, 0.08),
  padding: theme.spacing(2),
  borderRadius: '32px',
  boxShadow: (theme.vars || theme).shadows[1],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8, 8, 0),
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 4, 4),
    margin: theme.spacing(12, 8, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 6, 4),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
  ...theme.applyStyles("light", {
    backgroundColor: '#F9F5FF'
  })
}));

export const CompletedQuestHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  color: (theme.vars || theme).palette.text.primary,
}));

export const CompletedQuestTitle = styled(Typography)(({ theme }) => ({
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

export const CompletedQuestStack = styled(Stack)(() => ({
  marginTop: 32,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}));
