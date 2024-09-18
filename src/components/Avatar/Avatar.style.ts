import { Avatar, Box, Skeleton } from '@mui/material';
import { darken, styled } from '@mui/material/styles';

export const AvatarSkeletonContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '50%',
}));

export const LargeAvatar = styled(Avatar)(({ theme }) => ({
  background: 'transparent',
  width: 40,
  position: 'relative',
  height: 40,
  left: 6,
  top: 4.5,
  border: `6px solid transparent`,
  '& img': {
    objectFit: 'contain',
  },
}));

export const LargeAvatarSkeletonBase = styled(Skeleton)(({ theme }) => ({
  border: `6px solid ${theme.palette.surface1.main}`,
  width: 40,
  height: 40,
}));

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 17,
  height: 17,
  top: theme.spacing(-0.25),
  backgroundColor: theme.palette.surface1.main,
  // img: {
  //   padding: theme.spacing(0.25),
  //   borderRadius: '50%',
  //   objectFit: 'contain',
  //   background:
  //     theme.palette.mode === 'dark' ? theme.palette.white.main : 'inherit',
  // },
}));

export const SmallAvatarSkeletonBase = styled(Skeleton)(({ theme }) => ({
  border: `2px solid ${
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight400.main
      : darken(theme.palette.white.main, 0.04)
  }`,
  width: 17,
  height: 17,
}));
