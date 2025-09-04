import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { MissionHeroStatsCardVariant } from 'src/components/Cards/MissionHeroStatsCard/MissionHeroStatsCard.style';

export const CampaignHeroContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const CampaignHeroStatsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const CampaignHeroCardContainer = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    borderRadius: theme.shape.cardBorderRadius,
    boxShadow: theme.shadows[2],
  },
}));

export const CampaignHeroCardImageWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.cardBorderRadius,
  [theme.breakpoints.up('sm')]: {
    borderRadius: 0,
  },
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

interface CampaignHeroCardIconProps {
  variant?: MissionHeroStatsCardVariant;
}

export const CampaignHeroCardIcon = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<CampaignHeroCardIconProps>(({ theme, variant }) => ({
  position: 'relative',
  objectFit: 'contain',
  borderRadius: '50%',
  border: '2px solid',
  ...(variant === MissionHeroStatsCardVariant.Default && {
    borderColor: (theme.vars || theme).palette.lavenderLight[0],
  }),
  ...(variant === MissionHeroStatsCardVariant.Inverted && {
    borderColor: (theme.vars || theme).palette.alphaDark900.main,
  }),
}));

export const CampaignHeroCardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  top: 40,
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(5),
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    gap: theme.spacing(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

export const CampaignHeroCardContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 0, 0, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4, 3),
  },
}));

export const CampaignHeroCardTitle = styled(Typography)(({}) => ({}));

export const CampaignHeroCardDescription = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.alpha700.main,
  ...theme.applyStyles('light', {
    color: theme.palette.text.secondary,
  }),
}));

export const BaseSkeletonBox = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
