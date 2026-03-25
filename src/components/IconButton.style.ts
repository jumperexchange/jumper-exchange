import MuiIconButton from '@mui/material/IconButton';
import type { IconButtonProps } from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';

export const IconButton = styled(MuiIconButton)<IconButtonProps>(
  ({ theme }) => ({
    color: alpha(theme.palette.white.main, 0.88),
    transition: 'background 0.3s',
    width: '48px',
    height: '48px',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
      }),
    },
    ...theme.applyStyles('light', {
      color: alpha(theme.palette.black.main, 0.88),
      backgroundColor: (theme.vars || theme).palette.white.main,
    }),
  }),
);

export const IconButtonPrimary = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    color: (theme.vars || theme).palette.buttonPrimaryAction,
    backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
    ':hover': {
      backgroundColor: `oklch(from ${(theme.vars || theme).palette.buttonPrimaryBg} calc(l - 0.1) c h)`,
    },
  }),
);

export const IconButtonSecondary = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    // todo add color to theme
    color: (theme.vars || theme).palette.buttonSecondaryAction,
    backgroundColor: (theme.vars || theme).palette.buttonSecondaryBg,
    '&:hover': {
      backgroundColor: `oklch(from ${(theme.vars || theme).palette.buttonSecondaryBg} calc(l - 0.1) c h)`,
    },
  }),
);

export const IconButtonTertiary = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark300.main,
      }),
    },
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
    }),
  }),
);
