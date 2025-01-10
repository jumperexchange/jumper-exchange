'use client';

import { getContrastAlphaColor } from '@/utils/colors';
import type { TabProps, TabsProps } from '@mui/material';
import { Tab as MuiTab, Tabs, alpha, styled } from '@mui/material';

export const VerticalTabsContainer = styled(Tabs)<TabsProps>(({ theme }) => ({
  display: 'none',
  borderRadius: 28,
  padding: 0,
  backgroundColor: getContrastAlphaColor(theme, '4%'),
  alignItems: 'center',
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
    backgroundColor: theme.palette.white.main,
    zIndex: '-1',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.alphaLight300.main,
    }),
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
  ...theme.applyStyles('dark', {
    backgroundColor: getContrastAlphaColor(theme, '12%'),
  }),
}));

export const VerticalTab = styled(MuiTab)<TabProps>(({ theme }) => ({
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
  color: theme.palette.text.primary,
  textDecoration: 'none',
  ':hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.white.main,
    pointerEvents: 'none',
    ...theme.applyStyles('dark', {
      backgroundColor: alpha(theme.palette.white.main, 0.1),
    }),
  },
  ':not(.Mui-selected) > svg': {
    opacity: 0.5,
  },
  '> svg': {
    margin: 0,
  },
}));
