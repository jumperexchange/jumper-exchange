import type { Breakpoint } from '@mui/material/styles';
import { Box, styled } from '@mui/system';

export const XpIconContainer = styled(Box)(({ theme }) => ({
  marginLeft: 12,
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    marginLeft: 8,
  },
  display: 'flex',
  '& > svg': {
    width: 48,
    height: 48,
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      width: 30,
      height: 30,
    },
  },
}));

export const PointsBoxContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));
