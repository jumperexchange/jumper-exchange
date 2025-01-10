'use client';
import { getContrastAlphaColor } from '@/utils/colors';
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
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.accent1.main,
  },
}));

export const ButtonPrimary = styled(ButtonBase)<MuiButtonProps>(
  ({ theme }) => ({
    color: theme.palette.white.main,
    backgroundColor: theme.palette.primary.main,
    ':hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.16),
    },
  }),
);

export const ButtonSecondary = styled(ButtonBase)<MuiButtonProps>(
  ({ theme }) => ({
    backgroundColor: theme.palette.bgQuaternary.main,
    '&:hover': {
      backgroundColor: theme.palette.bgQuaternary.hover,
    },
  }),
);

export const ButtonTransparent = styled(ButtonBase)<MuiButtonProps>(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.white.main, 0.12)
        : alpha(theme.palette.black.main, 0.08),
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.white.main, 0.16)
          : alpha(theme.palette.black.main, 0.12),
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
      background: getContrastAlphaColor(theme, '4%'),
    },
  }),
);

export const LevelButton = styled(ButtonSecondary)<MuiButtonProps>(
  ({ theme }) => ({
    display: 'flex',
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.white.main,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    paddingLeft: '12px',
    height: '32px',
  }),
);
