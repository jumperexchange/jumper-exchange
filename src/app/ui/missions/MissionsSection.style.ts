import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const MissionSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const MissionSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

export const MissionSectionHeaderInfo = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.alphaLight700.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark700.main,
  }),
}));

export const BaseSkeletonBox = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
