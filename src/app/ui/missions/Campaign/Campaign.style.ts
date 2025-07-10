import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

export const CampaignCarouselContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 0, 4.5),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.surface1.main,
}));

export const CampaignContainer = styled(Box)(({}) => ({}));

export const CampaignImageContainer = styled(Box)(({}) => ({}));

interface CampaignImageProps extends ImageProps {
  isImageLoading: boolean;
}

export const CampaignImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isImageLoading',
})<CampaignImageProps>(({ isImageLoading }) => ({
  position: 'relative',
  objectFit: 'cover',
  borderRadius: '16px',
  aspectRatio: '2.2 / 1',
  width: '100%',
  opacity: isImageLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}));
