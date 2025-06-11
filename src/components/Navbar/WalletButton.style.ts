import { ButtonPrimary } from '@/components/Button';
import {
  alpha,
  Avatar,
  Badge,
  Skeleton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { ButtonTransparent } from '../Button';
import { avatarMask12 } from '../Mask.style';

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  height: 32,
  width: 32,
  padding: theme.spacing(0.5),
}));

export const WalletMgmtChainAvatar = styled(Avatar)(() => ({
  width: 12,
  height: 12,
  border: '2px solid white',
  background: 'transparent',
  left: 2.5,
  top: 1,
  img: {
    borderRadius: '50%',
  },
}));

export const WalletMgmtBadge = styled(Badge)(({ theme }) => ({
  borderRadius: '50%',
  border: '2px solid white',
  background: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    background: (theme.vars || theme).palette.alphaDark900.main,
  }),
  // overflow: 'hidden',
  '> .MuiAvatar-root': {
    mask: avatarMask12,
  },
}));

export const ConnectButtonWrapper = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(3),
  textWrap: 'nowrap',
  height: 48,
}));

export const ConnectButtonLabel = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

export const WalletMenuButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(1),
  gap: '0.5rem',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  },
  '&:hover:before': {
    backgroundColor: 'transparent',
  },
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    },
  }),
}));

export const ImageWalletMenuButton = styled(Image)(({ theme }) => ({
  borderRadius: '100%',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: alpha(theme.palette.white.main, 0.08),
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const SkeletonWalletMenuButton = styled(Skeleton)(({ theme }) => ({
  fontSize: 24,
  minWidth: 25,
  marginRight: 1.1,
  marginLeft: 1.1,
}));

export const WalletLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginRight: theme.spacing(0.25),
  marginLeft: theme.spacing(0.75),
  width: 'auto',
  color: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark900.main,
  }),
}));
