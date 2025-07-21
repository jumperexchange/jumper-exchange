import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

export const LevelCardContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const LevelCardContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

export const LevelProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const LevelGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
