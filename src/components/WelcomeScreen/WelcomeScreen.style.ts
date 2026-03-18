'use client';
import { ButtonPrimary } from '../Button';
import Box, { type BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

/**
 * more welcome-screen styles to be found in Widget.style.tsx + Widgets.style.tsx
 * Using dvh (dynamic viewport height) for mobile to handle iOS Safari keyboard/URL bar
 * Using vh for desktop where viewport is stable
 */

export const DEFAULT_WELCOME_SCREEN_HEIGHT = '55vh';
export const DEFAULT_WELCOME_SCREEN_HEIGHTS = {
  xs: '55dvh', // Dynamic viewport height for mobile (iOS Safari fix)
  md: '50vh', // Standard viewport for desktop
};

export interface ContentWrapperProps extends BoxProps {
  showWelcome?: boolean;
}

export const ContentWrapper = styled(Box)<ContentWrapperProps>(({ theme }) => ({
  textAlign: 'center',
  background: (theme.vars || theme).palette.bg.main,
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
    background: `linear-gradient(to top, ${(theme.vars || theme).palette.bg.main} 0%, transparent 100%)`,
    zIndex: '1000',
  },
}));

export const WelcomeContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 3),
  minHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.xs,
  [theme.breakpoints.up('sm')]: {
    minHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.md,
  },
}));

export const WelcomeScreenSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: 2,
  color: (theme.vars || theme).palette.accent1Alt.main,
  '& > .link-jumper': {
    fontWeight: 700,
    color: 'inherit',
    textDecoration: 'none',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const WelcomeScreenButton = styled(ButtonPrimary)(({ theme }) => ({
  height: 48,
  width: 192,
  margin: theme.spacing(4, 'auto'),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(6, 'auto'),
    height: 56,
    width: 247,
  },
}));

export const WelcomeScreenButtonLabel = styled(Typography)(({ theme }) => ({
  maxHeight: 40,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.up('sm')]: {
    fontSize: '18px',
    maxHeight: 48,
    lineHeight: '24px',
  },
}));
