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
  width: '96px',
  height: '84px',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.accent1Alt.main
      : theme.palette.primary.main,
  userSelect: 'none',
  background:
    theme.palette.mode === 'dark'
      ? theme.palette.surface3.main
      : theme.palette.white.main,
  borderRadius: '16px',
  transition: 'background 1.5s',
  '&:hover': {
    background: getContrastAlphaColor(theme, '12%'),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: '128px',
    height: '112px',
  },
}));
