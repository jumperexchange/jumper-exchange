import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

export const CampaignHeroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  borderRadius: `${theme.shape.cardBorderRadius}px`,
  boxShadow: theme.shadows[2],
}));

export const CampaignHeroStatsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const CampaignHeroCardContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
}));

export const CampaignHeroCardImageWrapper = styled(Box)(({}) => ({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
}));

interface CampaignHeroCardImageProps extends ImageProps {
  isImageLoading: boolean;
}

export const CampaignHeroCardImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isImageLoading',
})<CampaignHeroCardImageProps>(({ isImageLoading }) => ({
  position: 'relative',
  objectFit: 'cover',
  aspectRatio: '3.36 / 1',
  width: '100%',
  opacity: isImageLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}));

export const CampaignHeroCardIcon = styled(Image)(({ theme }) => ({
  position: 'relative',
  objectFit: 'contain',
  borderRadius: '50%',
  border: '2px solid',
  borderColor: (theme.vars || theme).palette.surface1.main,
}));

export const CampaignHeroCardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'center',
}));

export const CampaignHeroCardContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(4, 3),
}));

export const CampaignHeroCardTitle = styled(Typography)(({}) => ({}));

export const CampaignHeroCardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.alphaLight700.main,
  ...theme.applyStyles('light', {
    color: theme.palette.alphaDark700.main,
  }),
}));

export const BaseSkeletonBox = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
