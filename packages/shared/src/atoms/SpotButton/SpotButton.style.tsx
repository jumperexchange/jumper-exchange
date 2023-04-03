import type { IconButtonProps } from '@mui/material';
import { IconButton } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export interface SpotButtonProps extends Omit<IconButtonProps, 'variant'> {
  variant?: string;
}

export const SpotButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<SpotButtonProps>(({ theme, variant }) => ({
  color: theme.palette.text.primary,
  width: '64px',
  height: '64px',
  backgroundColor:
    variant === 'primary' && theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : variant === 'primary' && theme.palette.mode === 'light'
      ? theme.palette.secondary.main
      : theme.palette.mode === 'dark'
      ? getContrastAlphaColor(theme, '12%')
      : getContrastAlphaColor(theme, '4%'),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    borderRadius: '50%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: getContrastAlphaColor(theme, '4%'),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    display: 'flex',
  },
}));
