'use client';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MenuPaper } from 'src/components/Menu';

export const WalletHackedPaper = styled(MenuPaper)(({ theme }) => ({
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  maxWidth: `calc( 100% - 32px )`,
  borderRadius: '12px',
  margin: 'auto',
  height: 'auto !important',
  [theme.breakpoints.up('sm')]: {
    width: 480,
    height: 366,
  },
  [theme.breakpoints.up('md')]: {
    width: 480,
    height: 366,
  },
}));

export const WalletHackedContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  textAlign: 'center',
}));

export const ModalMenuHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const ModalMenuContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 16,
}));
