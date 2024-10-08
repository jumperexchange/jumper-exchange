import { Avatar, Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AvatarSkeletonContainer = styled(Box)<{ size: number }>(
  ({ size, theme }) => ({
    background: theme.palette.background.paper,
    borderRadius: '50%',
    width: size,
    height: size,
  }),
);

export const AvatarBase = styled(Avatar)<{ size: number }>(
  ({ size, theme }) => ({
    background: 'transparent',
    width: size,
    height: size,
    position: 'relative',
    border: `${size / 7.33}px solid transparent`, // Dynamic border based on size
    '& img': {
      objectFit: 'contain',
    },
  }),
);

export const AvatarSkeletonBase = styled(Skeleton)<{ size: number }>(
  ({ size, theme }) => ({
    border: `${size / 7.33}px solid ${theme.palette.surface1.main}`, // Dynamic border
    width: size,
    height: size,
  }),
);
