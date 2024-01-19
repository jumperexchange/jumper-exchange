import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

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
  height: 96,
  width: 96,
  '> img': {
    height: 58,
    width: 58,
  },
}));

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  height: 48,
  width: 48,
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
