'use client';

import { Tab as MuiTab, Tabs, alpha, styled } from '@mui/material';

export const VerticalTabsContainer = styled(Tabs)(({ theme }) => ({
  display: 'none',
  borderRadius: 28,
  padding: 0,
  alignItems: 'center',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @Note Figma elevation 4
  '&.MuiTabs-root': {
    backgroundColor: theme.palette.alphaLight300.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface3.main,
    }),
  },
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '8px',
    left: '4px',
    height: '48px',
    width: '48px',
    borderRadius: '28px',
    transform: 'translateY(0) scaleY(0.98)',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    zIndex: '-1',
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
    }),
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.black.main, 0.04),
  }),
}));

export const VerticalTab = styled(MuiTab)(({ theme }) => ({
  display: 'flex',
  height: 48,
  width: 48,
  padding: 0,
  minWidth: 48,
  borderRadius: 24,
  flexGrow: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(0.5),
  transition: 'background 250ms',
  background: 'transparent',
  minHeight: 'unset',
  color: (theme.vars || theme).palette.text.primary,
  textDecoration: 'none',
  ':hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    }),
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.white.main, 0.1),
    pointerEvents: 'none',
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
  ':not(.Mui-selected) > svg': {
    opacity: 0.64,
  },
  '> svg': {
    margin: 0,
  },
}));
