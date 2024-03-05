import { Box, Modal, alpha } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const PreviewImage = styled('img')(({ theme }) => ({
  maxHeight: '100%',
  borderRadius: '8px',
  maxWidth: '100%',
  '&:hover': { cursor: 'pointer' },
}));

export const LightboxModal = styled(Modal)(({ theme }) => ({
  zIndex: 1500,
}));

export const LightboxContainer = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.black.main, 0.72),
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
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 'calc( 100% - 32px)',
    margin: theme.spacing(2),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));
