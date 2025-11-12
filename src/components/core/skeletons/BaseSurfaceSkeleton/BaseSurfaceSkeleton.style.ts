import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

export const BaseSurfaceSkeleton = styled(Skeleton)(({ theme }) => ({
  transform: 'none',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));
