import { Box, styled } from '@mui/material';

export const WalletCardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.white.main,
  gap: theme.spacing(2),
  minWidth: 208,
  width: '100%',
  borderRadius: 16,
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    minWidth: 'auto',
    width: 208,
  },
}));
