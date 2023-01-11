import { styled } from '@mui/material/styles';
import { ButtonStyled } from '../button/Button.styled';
interface ConnectButtonBaseProps extends Omit<any, 'backgroundColor'> {
  hoverBackgroundColor?: string;
  color?: string;
  textColor?: string;
  bgColor?: string;
}

export const ConnectButtonBase = styled(ButtonStyled, {
  shouldForwardProp: (prop) =>
    prop !== 'bgColor' && prop !== 'hoverBackgroundColor' && prop !== 'color',
})<ConnectButtonBaseProps>(({ theme }) => ({
  display: 'none',
  width: '190px',
  letterSpacing: '0',
  textTransform: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
  },
}));
