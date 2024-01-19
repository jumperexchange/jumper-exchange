import type { Breakpoint } from '@mui/material';
import { styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const ToolCardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  width: 104,
  height: 96,
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
  transitionProperty: 'box-shadow, background',
  transitionDuration: '.3s',
  transitionTimingFunction: 'ease-in-out',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',
  '&:hover': {
    background:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.surface3.main, 0.72)
        : alpha(theme.palette.common.white, 0.64),
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
        : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 136,
    height: 120,
  },
}));
