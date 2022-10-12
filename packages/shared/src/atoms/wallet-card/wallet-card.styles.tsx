import { Avatar, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  border: '1px solid',
  borderColor: '#efefef',
  textAlign: 'center',
  width: '132px',

  '&:hover': {
    boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
}));

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  margin: '0 auto',
}));
