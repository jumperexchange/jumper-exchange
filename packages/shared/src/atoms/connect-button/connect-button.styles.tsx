import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ConnectButtonBaseType
  extends Omit<ButtonProps, 'backgroundColor'> {
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  // theme?: ITheme;
}

export const ConnectButtonBase = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundColor' && prop !== 'hoverBackgroundColor',
})<any>(({ theme, backgroundColor, hoverBackgroundColor }) => ({
  padding: '12px 16px',
  background: !!backgroundColor
    ? backgroundColor
    : theme.palette.brandSecondary.main, //#D63CA3
  borderRadius: '28px',
  color: 'white',
  width: '190px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: !!hoverBackgroundColor
      ? hoverBackgroundColor
      : theme.palette.brandSecondary.main,
  },
}));
