import { Box, Grid } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const BerachainIntroductionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(20),
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 32,
}));

export const BerachainIntroductionSteps = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

export const BerachainIntroductionStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(4, 3, 0, 3),
  position: 'relative',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderRadius: '16px',
  border: '1px solid #383433',
}));
