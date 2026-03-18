import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Image from 'next/image';

export const PreviewImage = styled(Image)(({ theme }) => ({
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  '&:hover': { cursor: 'pointer' },
}));

export const LightboxModal = styled(Modal)(({ theme }) => ({
  zIndex: 1500,
}));

export const LightboxContainer = styled(Box)(({ theme }) => ({
  background: `color-mix(in srgb, ${theme.palette.black.main} 72%, transparent)`,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
}));

export const LightboxImageContainer = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: 'auto',
  maxWidth: theme.breakpoints.values.md,
}));

export const LightboxImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  maxHeight: '90%',
  objectFit: 'contain',
  borderRadius: 8,
  [theme.breakpoints.up('sm')]: {
    maxWidth: 'calc( 100% - 32px)',
    margin: theme.spacing(2),
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));
