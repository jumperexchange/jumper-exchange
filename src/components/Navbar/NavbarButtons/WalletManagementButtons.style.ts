import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  background:
    theme.palette.mode === 'light' ? 'transparent' : theme.palette.white.main,
  borderRadius: '50%',
  height: '32px',
  width: '32px',
  padding: '6px',
}));
