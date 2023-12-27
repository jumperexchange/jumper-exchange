import { getContrastAlphaColor } from 'src/utils';
import type { ButtonProps } from '@mui/material';
import { Avatar, Button, darken } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WalletButtonProps extends ButtonProps {
  colored?: boolean;
}

export const AvatarContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  margin: 'auto',
}));

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  padding: theme.spacing(2.25),
  background:
    theme.palette.mode === 'light' ? 'transparent' : theme.palette.white.main,
  margin: 'auto',
  height: '88px',
  width: '88px',
  '> img': {
    height: '58px',
    width: '58px',
  },
}));

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  height: '44px',
  width: '44px',
  position: 'absolute',
  padding: '6px',
  right: '-18px',
  bottom: '-6px',
  borderRadius: '24px',
  background: 'white',
  img: {
    borderRadius: '23px',
  },
}));

export const WalletButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'colored',
})<WalletButtonProps>(({ theme, colored }) => ({
  borderRadius: '24px',
  padding: '10px 24px',
  backgroundColor:
    colored && theme.palette.mode === 'dark'
      ? theme.palette.primary.main
      : colored && theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.mode === 'dark'
          ? getContrastAlphaColor(theme, '12%')
          : getContrastAlphaColor(theme, '4%'),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : darken(theme.palette.white.main, 0.08),
  },
}));
