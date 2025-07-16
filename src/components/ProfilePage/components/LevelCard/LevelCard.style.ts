import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

export const LevelCardContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: (theme.vars || theme).shadows[1],
  background: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
  width: '100%',
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
