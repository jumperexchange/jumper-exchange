'use client';

import { getContrastAlphaColor } from '@/utils/colors';
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
