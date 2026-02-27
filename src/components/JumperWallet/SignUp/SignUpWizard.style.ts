import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const WizardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  maxWidth: 520,
  width: '100%',
  margin: '0 auto',
}));

export const WizardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  color: (theme.vars || theme).palette.text.primary,
  textAlign: 'center',
}));

export const WizardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: (theme.vars || theme).palette.text.secondary,
  textAlign: 'center',
}));

export const StepContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const ButtonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
}));

export const WarningBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1.5),
  backgroundColor: 'rgba(255, 167, 38, 0.08)',
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 167, 38, 0.12)',
  }),
  border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
}));
