import { Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  padding: theme.spacing(2.25),
  background: '#F7F9FB', //todo: proper color-name
  margin: 'auto',
  height: '96px',
  width: '96px',
  '> img': {
    height: '58px',
    width: '58px',
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
