'use client';

import { Typography, styled } from '@mui/material';

export const ToolCardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  cursor: 'pointer',
  width: 104,
  height: 96,
  color: (theme.vars || theme).palette.accent1Alt.main,
  userSelect: 'none',
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  borderRadius: theme.shape.radius16,
  transitionProperty: 'box-shadow, background',
  transitionDuration: '.3s',
  transitionTimingFunction: 'ease-in-out',
  boxShadow:
    '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
    backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    boxShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',
  }),
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    boxShadow: (theme.vars || theme).shadows[1],
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaLight400.main,
    }),
  },
  [theme.breakpoints.up('sm')]: {
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
