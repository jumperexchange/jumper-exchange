import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  background: '#F7F9FB',
  margin: 'auto',
  height: 96,
  width: 96,
  img: {
    objectFit: 'contain',
    background: 'transparent',
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
    borderRadius: '50%',
  },
}));
