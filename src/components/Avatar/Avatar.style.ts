import { Avatar, Box, Skeleton } from '@mui/material';
import { darken, styled } from '@mui/material/styles';

export const AvatarSkeletonContainer = styled(Box)(({ theme }) => ({
  background: (theme.vars || theme).palette.background.paper,
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
  border: `6px solid ${(theme.vars || theme).palette.surface1.main}`,
  width: 40,
  height: 40,
}));

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: (theme.vars || theme).palette.background.paper,
  width: 16,
  height: 16,
  top: theme.spacing(-0.25),
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  // img: {
  //   padding: theme.spacing(0.25),
  //   borderRadius: '50%',
  //   objectFit: 'contain',
  //   background: (theme.vars || theme).palette.text.primary,
  // },
}));

export const SmallAvatarSkeletonBase = styled(Skeleton)(({ theme }) => ({
  border:
    `2px solid ${(theme.vars || theme).palette.alphaLight400.main}`,
  width: 16,
  height: 16,
  ...theme.applyStyles("light", {
    border: `2px solid ${darken(theme.palette.white.main, 0.04)}`
  })
}));
