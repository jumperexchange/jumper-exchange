import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid',
  borderColor: '#efefef',
  alignContent: 'center',
  alignItems: 'center',

  '&:hover': {
    boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
}));

// export const WalletGridItem = styled(Grid)(({ theme }) => ({
//   padding: theme.spacing(3),
//   borderRadius: '8px',
//   border: '1px solid',
//   borderColor: '#efefef',
//   textAlign: 'center',
//   width: '132px',

//   '&:hover': {
//     boxShadow: '0px 0px 9px 0px rgba(0,0,0,0.1)',
//     cursor: 'pointer',
//   },
// }));

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: '12px',
}));
