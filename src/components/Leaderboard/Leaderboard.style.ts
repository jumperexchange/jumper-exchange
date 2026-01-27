import type { Breakpoint } from '@mui/material';
import { alpha, Box, Divider, Stack, styled } from '@mui/material';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  border: getSurfaceBorder(theme, 'surface2'),
  borderRadius: theme.shape.cardBorderRadiusXLarge,
  width: '100%',
  padding: theme.spacing(4, 2),
  boxShadow: (theme.vars || theme).shadows[2],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4),
  },
}));

export const LeaderboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

export const LeaderboardTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const LeaderboardUpdateDateBox = styled(Box)(() => ({
  marginLeft: '8px',
}));

export const LeaderboardEntryStack = styled(Stack)(({ theme }) => ({
  background: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  padding: theme.spacing(0, 1),
  borderRadius: theme.shape.cardBorderRadiusLarge,
  marginTop: theme.spacing(3),
  boxShadow: (theme.vars || theme).shadows[2],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(0, 3),
  },
}));

export const LeaderboardEntryDivider = styled(Divider)(({ theme }) => ({
  borderColor: alpha(theme.palette.text.primary, 0.08),
}));
