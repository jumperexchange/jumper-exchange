import { getContrastAlphaColor } from 'src/utils';
import type { ButtonProps } from '@mui/material';
import { Avatar, Button, Container, darken } from '@mui/material';
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
  height: 88,
  width: 88,
  '> img': {
    height: 58,
    width: 58,
  },
}));

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  height: 44,
  width: 44,
  position: 'absolute',
  padding: theme.spacing(0.75),
  right: theme.spacing(-2.25),
  bottom: -6,
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
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.white.main
      : theme.palette.black.main,
}));

export const WalletCardContainer = styled(Container)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  padding: '24px',
  display: 'flex',
  background: theme.palette.surface2.main,
  borderRadius: '16px',
}));

export const WalletCardButtonContainer = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'repeat(2, auto)',
  gridTemplateColumns: 'repeat(2, auto)',
  gridGap: '12px',
  justifyItems: 'center',
  alignItems: 'center',
  width: 'fit-content',
  padding: '0 !important',
}));
