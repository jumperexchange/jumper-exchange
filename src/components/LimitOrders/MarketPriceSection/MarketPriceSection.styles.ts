import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  transform: 'none',
  backgroundColor: (theme.vars || theme).palette.grey[100],
  borderRadius: theme.shape.buttonBorderRadius,
}));
