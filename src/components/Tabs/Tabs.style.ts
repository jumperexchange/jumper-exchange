'use client';

import { getContrastAlphaColor } from '@/utils/colors';
import type { TabProps, TabsProps } from '@mui/material';
import { Tab as MuiTab, Tabs, alpha, styled } from '@mui/material';

export const TabsContainer = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<TabsProps>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? getContrastAlphaColor(theme, '4%')
      : getContrastAlphaColor(theme, '12%'),
  padding: 1,
  alignItems: 'center',
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%) scaleY(0.98)',
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.white.main
        : theme.palette.alphaLight300.main,
    zIndex: '-1',
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
}));

export const Tab = styled(MuiTab, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<TabProps>(({ theme }) => ({
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
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&.Mui-selected': {
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.white.main
        : alpha(theme.palette.white.main, 0.1),
  },
  ':hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));
