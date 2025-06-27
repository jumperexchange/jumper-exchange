import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

export const MissionDetailsColumnContainer = styled(Box)(({ theme }) => ({
  maxWidth: theme.spacing(83),
}));

export const MissionDetailsCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  borderRadius: `${theme.shape.cardBorderRadius}px`,
  boxShadow: theme.shadows[2],
}));

export const MissionDetailsInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
  transform: 'none',
}));
