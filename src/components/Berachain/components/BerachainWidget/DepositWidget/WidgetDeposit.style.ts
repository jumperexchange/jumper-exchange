import { Accordion, alpha, Box, Button, styled } from '@mui/material';

export const MaxButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainColor',
})<any>(({ theme, mainColor }) => ({
  padding: theme.spacing(0.5, 1, 0.625, 1),
  lineHeight: 1.0715,
  fontSize: '0.875rem',
  minWidth: 'unset',
  height: 'auto',
  color: theme.palette.text.primary,
  backgroundColor: alpha(mainColor ?? theme.palette.primary.main, 0.78),
  '&:hover': {
    backgroundColor: alpha(mainColor ?? theme.palette.primary.main, 0.48),
  },
}));

export const BerachainWidgetSelection = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
  flexDirection: 'column',
  backgroundColor: '#1E1D1C',
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  gap: '8px',
}));

// TODO: Rename it to something more generic as it is used to have the most used berabackground
export const BerachainDepositInputBackground = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
  flexDirection: 'column',
  borderRadius: '16px',
  backgroundColor: '#1E1D1C',
  padding: theme.spacing(2),
  marginY: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  gap: '8px',
}));

export const BerachainDetailsAccordion = styled(Accordion)<{
  isExpanded?: boolean;
}>(({ theme, isExpanded }) => ({
  background: 'transparent',
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  cursor: 'pointer',
  boxShadow: 'none',
  width: '100%',
  backgroundColor: '#1E1D1C',
  borderRadius: '16px 16px 16px 16px',
  marginTop: 0,
}));

export const BoxForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));
