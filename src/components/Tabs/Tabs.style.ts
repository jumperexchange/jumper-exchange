'use client';

import { Tab as MuiTab, Tabs, alpha, styled } from '@mui/material';

export const TabsContainer = styled(Tabs)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.white.main, 0.12),
  padding: 1,
  alignItems: 'center',
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%) scaleY(0.98)',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    zIndex: '-1',
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.black.main, 0.04),
  }),
}));

export const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'initial',
  letterSpacing: 0,
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '20px',
  margin: theme.spacing(0.75, 0.5),
  transition: 'background 250ms',
  background: 'transparent',
  minHeight: 'unset',
  color: (theme.vars || theme).palette.text.primary,
  textDecoration: 'none',
  '&.Mui-selected': {
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor: alpha(theme.palette.white.main, 0.1),
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
  ':hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    }),
  },
}));

export const HorizontalTabsContainer = styled(Tabs)(({ theme }) => ({
  padding: 0,
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'unset',
  },
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '0',
    left: '0',
    height: 'auto',
    width: '100%',
    borderRadius: 24,
    transform: 'translateX(0) scaleX(0.98)',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    zIndex: -1,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
}));

export const HorizontalTab = styled(Tab)(({ theme }) => ({
  ...theme.typography.bodyMedium,
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'none',
  borderRadius: 24,
  width: 'auto',
  background: 'transparent',
  padding: theme.spacing(1.75, 2.5),
  margin: 0,
  transition: 'all 0.2s ease-in-out',
  color: `${(theme.vars || theme).palette.white.main} !important`,
  ...theme.applyStyles('light', {
    color: `${(theme.vars || theme).palette.text.primary} !important`,
  }),
  ':hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    }),
  },
  '&.Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
    pointerEvents: 'none',
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  },
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'unset',
  },
}));
