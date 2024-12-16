import { Box, Grid, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';
import Image from 'next/image';
import { ProfilePageContainer } from 'src/components/ProfilePage/ProfilePage.style';

export const BerachainIntroductionBox = styled(ProfilePageContainer)(
  ({ theme }) => ({
    marginTop: theme.spacing(10),
    color: theme.palette.text.primary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      gap: theme.spacing(4),
    },
  }),
);

export const BerachainIntroductionTitle = styled(Typography)(({ theme }) => ({
  letterSpacing: 0,
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(4, 0),
  },
}));

export const BerachainIntroductionSteps = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
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
  flexDirection: 'column',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  borderRadius: '16px',
  border: '1px solid #383433',
  background: 'transparent',
  transition: 'background-color 300ms ease-in-out',

  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    aspectRatio: 0.725,
    padding: theme.spacing(4, 3, 0, 3),
  },
}));

export const BerachainIntroductionStepContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BerachainIntroductionStepTitle = styled(Typography)(() => ({
  letterSpacing: 0,
}));

export const BerachainIntroductionStepIllustration = styled(Image)(() => ({
  aspectRatio: '1 / 1',
  width: '100%',
  height: 'auto',
}));

export const BerachainBearTyping = styled(
  BerachainIntroductionStepIllustration,
)(({ theme }) => ({
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    transform: 'translateX(24px)',
  },
}));
