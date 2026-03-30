import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const PreviewImage = styled(Image)(() => ({
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  '&:hover': { cursor: 'pointer' },
}));

export const LightboxModal = styled(Modal)(() => ({
  zIndex: 1500,
}));

export const LightboxContainer = styled(Box)(({ theme }) => ({
  background: `color-mix(in srgb, ${theme.palette.black.main} 72%, transparent)`,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  outline: 'none',
  '&:fullscreen': {
    background: `color-mix(in srgb, ${theme.palette.black.main} 90%, transparent)`,
  },
}));

export const LightboxToolbarContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(1),
  left: `50%`,
  transform: `translateX(-50%)`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: theme.spacing(2),
  zIndex: 10,
  backdropFilter: 'blur(24px)',
  background: (theme.vars || theme).palette.surface4.main,
  borderRadius: theme.shape.radius32,
  boxShadow: theme.shadows[2],
}));

interface LightboxImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  isDragging?: boolean;
}

export const LightboxImage = styled('img', {
  shouldForwardProp: (prop) =>
    !['scale', 'offsetX', 'offsetY', 'isDragging'].includes(prop as string),
})<LightboxImageProps>(
  ({ theme, scale = 1, offsetX = 0, offsetY = 0, isDragging = false }) => ({
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '90%',
    objectFit: 'contain',
    borderRadius: 8,
    userSelect: 'none',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
    transformOrigin: 'center center',
    cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    [theme.breakpoints.up('sm')]: {
      maxWidth: 'calc(100% - 32px)',
      margin: theme.spacing(2),
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: theme.breakpoints.values.lg,
    },
  }),
);
