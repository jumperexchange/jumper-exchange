'use client';

import type { Breakpoint } from '@mui/material';
import { Typography, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const ToolCardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  cursor: 'pointer',
  width: 104,
  height: 96,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
  userSelect: 'none',
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '16px',
  transitionProperty: 'box-shadow, background',
  transitionDuration: '.3s',
  transitionTimingFunction: 'ease-in-out',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)'
      : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.white.main, 0.2)
        : alpha(theme.palette.white.main, 0.8),
    boxShadow: theme.shadows[1],
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 136,
    height: 120,
  },
}));

export const ToolCardCounter = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  lineHeight: '32px',
  pointerEvents: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 80,
  maxHeight: 32,
  [theme.breakpoints.up('sm')]: {
    fontSize: 32,
    maxHeight: 40,
    lineHeight: '40px',
  },
}));

export const ToolCardTitle = styled(Typography)(({ theme }) => ({
  pointerEvents: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 80,
  maxHeight: 20,
  [theme.breakpoints.up('sm')]: {
    mt: 0.5,
    fontSize: '16px',
    maxWidth: 118,
  },
}));
