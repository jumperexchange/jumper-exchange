import { ButtonPrimary } from '@/components/Button';
import { Avatar, Badge, styled } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils/colors';
import { ButtonTransparent } from '../Button';
import { avatarMask12 } from '../Mask.style';

export const WalletMgmtWalletAvatar = styled(Avatar)(() => ({
  height: 32,
  width: 32,
}));

export const WalletMgmtChainAvatar = styled(Avatar)(() => ({
  width: 16,
  height: 16,
  border: '2px solid transparent',
  background: 'transparent',
  left: 2.5,
  top: 2.5,
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

export const ConnectButton = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(3),
  textWrap: 'nowrap',
}));

export const WalletMenuButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: getContrastAlphaColor(theme, '4%'),
  },
}));
