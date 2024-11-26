import { Box, Grid, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';
import Image from 'next/image';

export const BerachainIntroductionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(10),
  color: theme.palette.text.primary,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gap: theme.spacing(4),
  },
}));

export const BerachainIntroductionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
}));

export const BerachainIntroductionSteps = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
  margin: theme.spacing(4, 0),
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: theme.spacing(4),
  },
}));

export const BerachainIntroductionStep = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(4, 0, 4, 3),
  width: '100%',
  position: 'relative',
  flexDirection: 'row',
  gap: theme.spacing(2),
  borderRadius: '16px',
  border: '1px solid #383433',
  background: 'transparent',
  transition: 'background-color 300ms ease-in-out',

  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    aspectRatio: 0.725,
    flexDirection: 'column',
    padding: theme.spacing(4, 3, 0, 3),
  },
}));

export const BerachainIntroductionStepContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BerachainIntroductionStepIllustration = styled(Image)(
  ({ theme }) => ({
    aspectRatio: '1 / 1',
    width: '40%',
    height: 'auto',
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      width: '100%',
    },
  }),
);

export const BerachainBearTyping = styled(
  BerachainIntroductionStepIllustration,
)(({ theme }) => ({
  // transform: 'translateX(24px)',
}));
