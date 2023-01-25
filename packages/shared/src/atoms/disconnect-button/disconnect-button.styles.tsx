import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

interface DisconnectButtonBaseProps extends Omit<any, 'backgroundColor'> {
  //ButtonProps
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  color?: string;
}

export const DisconnectButtonBase = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' &&
    prop !== 'hoverBackgroundColor' &&
    prop !== 'color',
})<DisconnectButtonBaseProps>(
  ({ theme, backgroundColor, hoverBackgroundColor, color }) => ({
    padding: '8px',
    paddingRight: '16px',
    color: !!color ? color : theme.palette.black.main,
    height: '48px',
    background: backgroundColor ? backgroundColor : theme.palette.white.main,
    borderRadius: '28px',
    textTransform: 'none',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    '&:hover': {
      background: hoverBackgroundColor
        ? hoverBackgroundColor
        : theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[500],
    },
    [theme.breakpoints.up('md')]: {
      position: 'relative',
      left: 'unset',
      transform: 'unset',
    },
  }),
);
