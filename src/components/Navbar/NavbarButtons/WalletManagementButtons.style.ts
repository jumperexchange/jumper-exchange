import { Avatar } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const WalletMgmtAvatarContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(1.5),
}));

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  background:
    theme.palette.mode === 'light' ? 'transparent' : theme.palette.white.main,
  height: 32,
  width: 32,
  padding: theme.spacing(0.5),
  mr: theme.spacing(1),
  ml: theme.spacing(0.25),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    mr: theme.spacing(0),
    ml: theme.spacing(0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    mr: theme.spacing(1),
    ml: theme.spacing(0.25),
  },
}));

export const WalletMgmtChainAvatar = styled(Avatar)(({ theme }) => ({
  height: 20,
  width: 20,
  position: 'absolute',
  padding: theme.spacing(0.5),
  right: -10,
  borderRadius: '10px',
  bottom: theme.spacing(-0.75),
  background: 'white',
  img: {
    borderRadius: '6px',
  },
}));
