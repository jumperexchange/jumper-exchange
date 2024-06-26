import { Box, Breakpoint, Typography, alpha, styled } from '@mui/material';
import { sequel85 } from 'src/fonts/fonts';

export const BackButtonMainBox = styled(Box)(({ theme }) => ({
  width: '80%',
  display: 'flex',
  mb: '16px',
}));

export const ButtonTypography = styled(Typography)(({ theme }) => ({
  ml: '4px',
  mr: '4px',
  fontSize: '14px',
  typography: sequel85.style.fontFamily,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 208,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 168,
  },
}));
