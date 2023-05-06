import { Breakpoint, styled } from '@mui/material';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';

export const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {},
}));

export const Card = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(6, 8),
  width: '128px',
  background: getContrastAlphaColor(theme, '8%'),
  borderRadius: '16px',
  transition: 'background 1.5s',
  '&:hover': {
    background: getContrastAlphaColor(theme, '28%'),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {},
}));
