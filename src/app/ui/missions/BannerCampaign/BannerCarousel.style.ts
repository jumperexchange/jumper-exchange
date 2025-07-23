import Box, { BoxProps } from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

interface CarouselOuterContainerProps extends BoxProps {
  hasPagination?: boolean;
}

export const CarouselOuterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasPagination',
})<CarouselOuterContainerProps>(({ theme, hasPagination }) => ({
  marginBottom: hasPagination ? theme.spacing(1.5) : 0,
  position: 'relative',
}));

export const BannerSlideContainer = styled(Box)(({ onClick }) => ({
  ...(!!onClick && {
    cursor: 'pointer',
  }),
}));

export const BannerImageWrapper = styled(Box)(({}) => ({
  borderRadius: 16,
  width: '100%',
  overflow: 'hidden',
}));

interface BannerImageProps extends ImageProps {
  isImageLoading: boolean;
}

export const BannerImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isImageLoading',
})<BannerImageProps>(({ isImageLoading }) => ({
  position: 'relative',
  objectFit: 'cover',
  borderRadius: 16,
  aspectRatio: '2.2 / 1',
  width: '100%',
  opacity: isImageLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}));

export const BannerContentOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
}));

export const CarouselSkeletonBox = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  borderRadius: 16,
}));
