import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

export interface MissionTaskContainerProps extends BoxProps {
  isActive?: boolean;
}

export const MissionTaskContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<MissionTaskContainerProps>(({ theme, isActive, onClick }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: `1px solid transparent`,
  cursor: !!onClick ? 'pointer' : 'initial',
  padding: theme.spacing(3),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  transition: 'all .2s ease-in',
  ...(isActive && {
    border: `1px solid ${(theme.vars || theme).palette.orchid[600]}`,
    backgroundColor: (theme.vars || theme).palette.bgQuaternary.main,
    ...theme.applyStyles('light', {
      border: `1px solid ${(theme.vars || theme).palette.orchid[400]}`,
      backgroundColor: (theme.vars || theme).palette.orchid[100],
    }),
  }),
}));

export const MissionTaskHeaderContainer = styled(
  Box,
  {},
)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}));

export const MissionTaskTitle = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  ...theme.typography.bodyLargeStrong,
}));

export const MissionTaskDescription = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.bodySmall,
}));

export const MissionTaskTypeBadge = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.alphaLight100.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark100.main,
  }),
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
  transform: 'none',
}));
