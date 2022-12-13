import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ConnectButtonBase = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' &&
    prop !== 'hoverBackgroundColor' &&
    prop !== 'color',
})<any>(({ theme, backgroundColor, hoverBackgroundColor, color }) => ({
  display: 'none',
  padding: '12px 16px',
  background: !!backgroundColor
    ? backgroundColor
    : theme.palette.secondary.main, //#D63CA3
  borderRadius: '28px',
  color: !!color ? color : 'white',
  width: '190px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: !!hoverBackgroundColor
      ? hoverBackgroundColor
      : theme.palette.secondary.main,
  },
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
  },
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
  },
}));
