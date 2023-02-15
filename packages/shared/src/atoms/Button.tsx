import { Button as MuiButton, ButtonProps } from '@mui/material'; //ButtonProps
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';

export interface ButtonBaseProps extends Omit<ButtonProps, 'component'> {
  textColor?: string;
  bgColor?: string;
}

export const Button: any = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'textColor' && prop !== 'bgColor',
})<ButtonBaseProps>(({ theme, textColor, bgColor }) => ({
  height: '48px',
  borderRadius: '24px',
  fontSize: '16px',
  letterSpacing: '0',
  textTransform: 'none',
  fontWeight: 'bold',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.black.main
      : theme.palette.white.main,
  '*': {
    zIndex: 1,
  },
  // ':before': {
  //   content: '" "',
  //   zIndex: 1,
  //   borderRadius: '24px',
  //   background: 'transparent',
  //   position: 'absolute',
  //   top: 0,
  //   right: 0,
  //   bottom: 0,
  //   left: 0,
  // },
  '> .MuiTouchRipple-root': {
    backgroundColor: 'unset !important',
  },
  '&:hover': {
    backgroundColor: bgColor
      ? bgColor
      : theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : theme.palette.accent1.main,
    ':before': {
      background: getContrastAlphaColor(theme, '4%'),
    },
    '.MuiTouchRipple-root': {
      backgroundColor: 'unset !important',
    },
  },
}));
