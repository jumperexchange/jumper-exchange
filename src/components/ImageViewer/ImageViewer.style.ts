import { styled } from '@mui/material/styles';

export const PreviewImage = styled('img')(({ theme }) => ({
  maxHeight: '100%',
  maxWidth: '100%',
  '&:hover': { cursor: 'pointer' },
}));

export const ModalImageContainer = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  // height: '100%',
  width: '100%',
  height: 'auto',
  maxWidth: theme.breakpoints.values.md,
}));

export const ModalImage = styled('img')(({ theme }) => ({
  // height: '100%',
  width: '100%',
  height: 'auto',
  maxWidth: theme.breakpoints.values.md,
}));
