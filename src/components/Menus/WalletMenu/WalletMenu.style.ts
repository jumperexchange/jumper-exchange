import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  background: '#F7F9FB',
  margin: 'auto',
  height: '96px',
  width: '96px',
  img: {
    objectFit: 'contain',
    background: 'transparent',
  },
}));

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  height: '48px',
  width: '48px',
  position: 'absolute',
  padding: '6px',
  right: '-18px',
  bottom: '-6px',
  borderRadius: '24px',
  background: 'white',
  img: {
    borderRadius: '50%',
  },
}));
