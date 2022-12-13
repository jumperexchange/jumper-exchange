import { Button } from '@mui/material'; //ButtonProps
import { styled } from '@mui/material/styles';
interface ConnectButtonBaseProps extends Omit<any, 'backgroundColor'> {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  color?: string;
}

export const ConnectButtonBase = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' &&
    prop !== 'hoverBackgroundColor' &&
    prop !== 'color',
})<ConnectButtonBaseProps>(
  ({ theme, backgroundColor, hoverBackgroundColor, color }) => ({
    display: 'none',
    padding: '12px 16px',
    height: '48px',
    background: !!backgroundColor
      ? backgroundColor
      : theme.palette.accent2.main, //#D63CA3
    borderRadius: '28px',
    color: !!color ? color : 'white',
    width: '190px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: !!hoverBackgroundColor
        ? hoverBackgroundColor
        : theme.palette.accent2.main,
    },
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex',
    },
  }),
);
