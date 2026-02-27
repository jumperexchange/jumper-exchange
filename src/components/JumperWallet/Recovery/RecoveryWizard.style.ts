import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RecoveryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  maxWidth: 520,
  width: '100%',
  margin: '0 auto',
}));

export const RecoveryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  color: (theme.vars || theme).palette.text.primary,
  textAlign: 'center',
}));

export const ShareInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
