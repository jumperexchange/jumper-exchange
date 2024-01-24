import { Avatar, Badge as MuiBadge } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  background:
    theme.palette.mode === 'light' ? 'transparent' : theme.palette.white.main,
  borderRadius: '50%',
  height: 32,
  width: 32,
  padding: theme.spacing(0.75),
}));

export const Badge = styled(MuiBadge)(({ theme }) => ({
  background: theme.palette.surface1.main,
  borderRadius: '50%',
  '& > span': { paddingLeft: theme.spacing(1.5), zIndex: 0 },
}));
