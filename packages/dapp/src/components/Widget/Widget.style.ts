import { styled } from '@mui/material';

export const GlowBackground = styled('span')(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  zIndex: -1,
  minWidth: '440px',
  minHeight: '440px',
  width: '50vw',
  height: '50vw',
  transform: 'translateX(-50%)',
  left: '50%',
  top: '80px',
}));
