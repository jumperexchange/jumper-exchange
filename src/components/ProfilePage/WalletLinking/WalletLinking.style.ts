import { Box, styled } from '@mui/material';
import { MenuPaper } from 'src/components/Menu';

export const WalletLinkingPaper = styled(MenuPaper)(({ theme }) => ({
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxWidth: `calc( 100% - 32px )`,
  margin: 'auto',
  height: 'auto !important',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '480px',
    width: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '480px',
    width: 'auto',
  },
}));

export const WalletLinkingContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
}));
