import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export const TraitsContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '32px',
  width: '100%',
  padding: theme.spacing(4, 2),
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(4),
  },
}));

export const TraitsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start',
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gap: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
}));

export const TraitsTitleBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const TraitsUpdateDateBox = styled(Box)(() => ({
  marginLeft: '8px',
}));
