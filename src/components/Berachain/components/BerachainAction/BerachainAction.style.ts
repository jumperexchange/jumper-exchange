import { Box, Button, Typography } from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';

export const BerachainActionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(20),
  color: theme.palette.text.primary,
  display: 'flex',
  gap: 62,
}));

export const BerachainActionContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionSubtitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionLearnMoreCTA = styled(Button)(({ theme }) => ({
  height: 40,
  backgroundColor: theme.palette.white.main,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  width: 120,
  marginTop: theme.spacing(5),
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.08),
  },
}));

export const BerachainActionExamplesBox = styled(Box)(({ theme }) => ({
  width: 372,
  padding: theme.spacing(2, 3),
  marginTop: theme.spacing(10),
  backgroundColor: theme.palette.surface1.main,
  border: alpha(theme.palette.black.main, 0.08),
  borderRadius: '16px',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const BerachainActionExamplesContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
}));

export const BerachainActionExamplesIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));
