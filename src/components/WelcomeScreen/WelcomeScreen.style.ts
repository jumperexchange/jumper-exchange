'use client';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import { ButtonPrimary } from '../Button';

/**
 * more welcome-screen styles to be found in Widget.style.tsx + Widgets.style.tsx
 */

export const DEFAULT_WELCOME_SCREEN_HEIGHT = '50vh';

export interface ContentWrapperProps extends Omit<BoxProps, 'component'> {
  showWelcome?: boolean;
}

export const ContentWrapper = styled(
  Box,
  {},
)<ContentWrapperProps>(({ theme }) => ({
  textAlign: 'center',
  background: theme.palette.mode === 'dark' ? '#1A1033' : '#F3EBFF',
  width: '100%',
  zIndex: '1400',
  height: 'auto',

  '&:before': {
    content: '" "',
    position: 'absolute',
    height: '35%',
    top: '-35%',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, #1A1033 0%, transparent 100%)'
        : 'linear-gradient(to top, #F3EBFF 0%, transparent 100%)',
    zIndex: '1000',
  },
}));

export const WelcomeContent = styled(Box)<BoxProps>(({ theme }) => ({
  minHeight: DEFAULT_WELCOME_SCREEN_HEIGHT,
}));

export const WelcomeScreenSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: 2,
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.accent1Alt.main
      : theme.palette.primary.main,
  '& > .link-jumper': {
    fontWeight: 700,
    color: 'inherit',
    textDecoration: 'none',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
  },
}));

export const WelcomeScreenButton = styled(ButtonPrimary)(({ theme }) => ({
  height: 48,
  width: 192,
  margin: theme.spacing(4, 'auto'),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(6, 'auto'),
    height: 56,
    borderRadius: '28px',
    width: 247,
  },
}));

export const WelcomeScreenButtonLabel = styled(Typography)(({ theme }) => ({
  maxHeight: 40,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '18px',
    maxHeight: 48,
    lineHeight: '24px',
  },
}));
