import { Box, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletSlide = styled(Slide)<any>(({ theme }) => ({
  zIndex: 2,
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: '100vw',
  height: '100vh',
}));

export const WalletDialogBackground = styled(Box)<any>(({ theme }) => ({
  position: 'absolute',
  right: 0,
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  bottom: 0,
  opacity: 0,
  display: 'flex',
  padding: 2,
  overflow: 'hidden',
  zIndex: 1,
  pointerEvents: 'none',
  background: theme.palette.background.default,
  fillOpacity: 1,
}));

export const WalletDialogWrapper = styled(Box)<any>(({ theme }) => ({}));

export const WalletDialog = styled(Box)<any>(({ theme }) => ({
  background: theme.palette.background.default,
  padding: '28px',
  margin: '0 auto',
  overflowY: 'scroll',
  zIndex: 2,
  width: '400px',
  height: '100vh',
  position: 'absolute',
  right: 0,
  borderTopLeftRadius: '16px',

  // /* width */
  // '&::-webkit-scrollbar': {
  //   width: '10px',
  // },

  // /* Track */
  // '&::-webkit-scrollbar-track': {
  //   background: '#31007a8c', //#f1f1f1
  // },

  // /* Handle */
  // '&::-webkit-scrollbar-thumb': {
  //   background: '#31007A', //#888
  //   borderRadius: '5px',
  // },

  // /* Handle on hover */
  // '&::-webkit-scrollbar-thumb:hover': {
  //   background: '#555',
  // },
}));

export const WalletCardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '24px',
}));

// WalletCardsContainer replaces WalletCardGrid
// export const WalletCardGrid = styled(Grid)(({ theme }) => ({
//   margin: '0 auto',
// }));
