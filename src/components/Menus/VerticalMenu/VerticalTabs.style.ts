'use client';

import { getContrastAlphaColor } from '@/utils/colors';
import { Tab as MuiTab, Tabs, alpha, styled } from '@mui/material';

export const VerticalTabsContainer = styled(Tabs)(({ theme }) => ({
  display: 'none',
  borderRadius: 28,
  padding: 0,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? getContrastAlphaColor(theme, '12%')
      : getContrastAlphaColor(theme, '4%'),
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
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
    zIndex: '-1',
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
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
  color: theme.palette.text.primary,
  textDecoration: 'none',
  ':hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
  '&.Mui-selected': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.white.main, 0.1)
        : theme.palette.white.main,
    pointerEvents: 'none',
  },
  ':not(.Mui-selected) > svg': {
    opacity: 0.5,
  },
  '> svg': {
    margin: 0,
  },
}));
