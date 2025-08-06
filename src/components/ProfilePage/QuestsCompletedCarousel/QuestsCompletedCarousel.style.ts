import type { Breakpoint } from '@mui/material';
import { Box, Stack, Typography, styled } from '@mui/material';

export const CompletedQuestContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  borderRadius: '24px',
  padding: theme.spacing(2, 1),
  paddingBottom: theme.spacing(1.25),
  boxShadow: (theme.vars || theme).shadows[1],
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4, 3, 3.25),
  },
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
