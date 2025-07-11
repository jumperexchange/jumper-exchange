import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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

export const CampaignContentContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
}));

export enum CampaignInfoItemVariant {
  Default = 'default',
  Inverted = 'inverted',
}

interface CampaignInfoItemProps {
  variant?: CampaignInfoItemVariant;
}

export const CampaignInfoItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<CampaignInfoItemProps>(
  ({ theme, variant = CampaignInfoItemVariant.Default }) => ({
    padding: theme.spacing(1, 1.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: 16,

    ...(variant === CampaignInfoItemVariant.Default && {
      backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
      color: (theme.vars || theme).palette.alphaLight900.main,
      border: `1px solid ${(theme.vars || theme).palette.alphaLight200.main}`,
    }),

    ...(variant === CampaignInfoItemVariant.Inverted && {
      color: (theme.vars || theme).palette.text.primary,
    }),
  }),
);

export const CampaignInfoText = styled(Typography)(({ theme }) => ({}));
