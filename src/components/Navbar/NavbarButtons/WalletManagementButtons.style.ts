import { Avatar, Badge as MuiBadge } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  background:
    theme.palette.mode === 'light' ? 'transparent' : theme.palette.white.main,
  borderRadius: '50%',
  height: '32px',
  width: '32px',
  padding: '6px',
}));

export const Badge = styled(MuiBadge)(({ theme }) => ({
  background: theme.palette.surface1.main,
  borderRadius: '50%',
  '& > span': { paddingLeft: theme.spacing(1.5), zIndex: 0 },
}));
