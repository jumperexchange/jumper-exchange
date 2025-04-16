'use client';
import type { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton, alpha, darken } from '@mui/material'; //ButtonProps
import { styled } from '@mui/material/styles';

const ButtonBase = styled(MuiButton)<MuiButtonProps>(({ theme }) => ({
  borderRadius: '24px',
  fontSize: '16px',
  letterSpacing: 0,
  textTransform: 'none',
  fontWeight: 'bold',
  transition: 'background-color 250ms',
  overflow: 'hidden',
  color: (theme.vars || theme).palette.text.primary,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.accent1.main,
    }),
  },
}));

export const ButtonPrimary = styled(ButtonBase)(({ theme }) => ({
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  ':hover': {
    backgroundColor: (theme.vars || theme).palette.primary.dark,
  },
}));

export const ButtonSecondary = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.bgQuaternary.main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.bgQuaternary.hover,
  },
}));

export const ButtonTransparent = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.white.main, 0.04),
  ...theme.applyStyles('light', {
    background: alpha(theme.palette.black.main, 0.08),
  }),
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.12),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.08),
    }),
  },
  '&:before': {
    content: '" "',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background 250ms',
    background: 'transparent',
    borderRadius: 'inherit',
  },
  '&:hover:before': {
    background: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    }),
  },
}));

export const SuperfestButton = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.42),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.56),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    }),
  },
  ...theme.applyStyles('light', {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  }),
}));

export const LevelButton = styled(ButtonSecondary)(({ theme }) => ({
  display: 'flex',
  color: (theme.vars || theme).palette.white.main,
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none',
  paddingLeft: '12px',
  height: '32px',
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));
