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

export const WalletMgmtWalletAvatar = styled(Avatar)(() => ({
  height: 32,
  width: 32,
}));

export const WalletMgmtChainAvatar = styled(Avatar)(() => ({
  width: 18,
  height: 18,
  border: '2px solid transparent',
  background: 'transparent',
  left: 2.5,
  top: 1,
  img: {
    borderRadius: '50%',
  },
}));

export const WalletMgmtBadge = styled(Badge)(({ theme }) => ({
  borderRadius: '50%',
  // overflow: 'hidden',
  '> .MuiAvatar-root': {
    mask: avatarMask12,
  },
}));

export const ConnectButtonWrapper = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(3),
  textWrap: 'nowrap',
  height: 48
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
  paddingRight: theme.spacing(1.5),
  gap: '0.5rem',
  backgroundColor:
    (theme.vars || theme).palette.alphaLight300.main,
  boxShadow: '0px 2px 8px 0px #00000014',
  '&:hover': {
    backgroundColor:
      (theme.vars || theme).palette.alphaLight300.main,
    ...theme.applyStyles("light", {
      backgroundColor: (theme.vars || theme).palette.white.main
    })
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: alpha(theme.palette.white.main, 0.04)
  },
  ...theme.applyStyles("light", {
    backgroundColor: (theme.vars || theme).palette.white.main
  })
}));

export const ImageWalletMenuButton = styled(Image)(({ theme }) => ({
  borderRadius: '100%',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor:
    alpha(theme.palette.white.main, 0.08),
  ...theme.applyStyles("light", {
    borderColor: (theme.vars || theme).palette.white.main
  })
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
}));
