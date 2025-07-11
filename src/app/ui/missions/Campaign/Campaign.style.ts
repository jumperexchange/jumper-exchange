import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ImageProps } from 'next/image';
import Image from 'next/image';

export const CampaignCarouselContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3, 0, 4.5),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
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
  borderRadius: 16,
  aspectRatio: '2.2 / 1',
  width: '100%',
  opacity: isImageLoading ? 0 : 1,
  transition: 'opacity 0.2s ease-in-out',
}));

export const CampaignContentContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
}));

export enum InfoCardVariant {
  Default = 'default',
  Inverted = 'inverted',
}

interface CampaignInfoCardContainerProps {
  variant?: InfoCardVariant;
}

export const CampaignInfoCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<CampaignInfoCardContainerProps>(
  ({ theme, variant = InfoCardVariant.Default }) => ({
    position: 'relative',
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    border: `1px solid ${(theme.vars || theme).palette.alphaLight200.main}`,

    ...(variant === InfoCardVariant.Default && {
      color: (theme.vars || theme).palette.alphaLight900.main,
    }),

    ...(variant === InfoCardVariant.Inverted && {
      color: (theme.vars || theme).palette.alphaDark900.main,
    }),

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      filter: 'blur(8px)',
      zIndex: -1,
    },
  }),
);

export const CampaignInfoText = styled(Typography)(({ theme }) => ({}));

export const ChainStackContainer = styled(Stack)(({ theme }) => ({}));

// @Note extract this in a separate component
const BaseAvatar = styled(Avatar)(({ theme }) => ({
  boxSizing: 'content-box',
  border: 2,
  borderStyle: 'solid',
  borderColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const ChainAvatar = styled(BaseAvatar)(() => ({
  height: 24,
  width: 24,
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  borderRadius: 16,
}));
