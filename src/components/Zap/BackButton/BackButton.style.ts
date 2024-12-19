import { type Breakpoint, Typography, styled } from '@mui/material';
import { ButtonPrimary } from 'src/components/Button';
import { urbanist } from 'src/fonts/fonts';

export const BackButtonStyles = styled(ButtonPrimary)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignContent: 'center',
  alignItems: 'center',
}));

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  marginLeft: '4px',
  fontSize: '14px',
  typography: urbanist.style.fontFamily,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 232,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 168,
  },
}));
