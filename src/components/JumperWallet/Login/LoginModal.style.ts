import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  maxWidth: 400,
  width: '100%',
  margin: '0 auto',
}));

export const LoginTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  color: (theme.vars || theme).palette.text.primary,
  textAlign: 'center',
}));

export const ForgotPasswordLink = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: (theme.vars || theme).palette.text.secondary,
  cursor: 'pointer',
  textAlign: 'center',
  '&:hover': {
    textDecoration: 'underline',
    color: (theme.vars || theme).palette.text.primary,
  },
}));
