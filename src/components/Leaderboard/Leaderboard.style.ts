import type { Breakpoint } from '@mui/material';
import { Box, Stack, styled, Typography } from '@mui/material';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4, 2),
  boxShadow: theme.palette.shadow.main,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4),
  },
}));

export const LeaderboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  alignItems: 'center',
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

export const LeaderboardUpdateDateLabel = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.alphaDark100.main,
  borderRadius: '16px',
}));

export const LeaderboardEntryStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.bgTertiary.main,
  padding: theme.spacing(0, 1),
  borderRadius: '24px',
  marginTop: theme.spacing(3),
  boxShadow: theme.palette.shadowLight.main,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(0, 3),
  },
}));
