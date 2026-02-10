'use client';

import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { styled } from '@mui/material/styles';
import { inter } from 'src/fonts/fonts';

export interface CardProps extends MuiCardProps {
  backgroundImageUrl?: string;
  isDarkCard?: boolean;
}

export const FCard = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundImageUrl' && prop !== 'isDarkCard',
})<CardProps>(({ theme, backgroundImageUrl, isDarkCard }) => ({
  width: 384,
  height: 160,
  cursor: 'pointer',
  borderRadius: theme.shape.cardBorderRadiusSmall,
  position: 'relative',
  marginBottom: theme.spacing(1.5),
  overflow: 'hidden',
  backgroundImage: `url(${backgroundImageUrl}), radial-gradient(circle at 506px 437px, #3F49E1 -43%, ${isDarkCard ? theme.palette.surface1.main : null} 506px 349px)`,
  backgroundSize: 'contain',
  boxShadow: theme.shadows[1],
  ':last-child': {
    marginBottom: 0,
  },
}));

export const FeatureCardContent = styled(CardContent)(({ theme }) => ({
  fontFamily: inter.style.fontFamily,
  padding: theme.spacing(3),
  position: 'relative',
}));

export const FeatureCardCloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 1,
  top: 1,
}));

export const FeatureCardTitle = styled(Typography)(() => ({
  fontSize: '24px',
  lineHeight: '32px',
  userSelect: 'none',
  maxHeight: 32,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const FeatureCardSubtitle = styled(Typography)(() => ({
  lineHeight: '24px',
  width: 224,
  userSelect: 'none',
  height: 48,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const FeatureCardActions = styled(CardActions)(({ theme }) => ({
  padding: 0,
  marginTop: theme.spacing(1),
}));

export const FeatureCardCtaLink = styled(Link)(() => ({
  textDecoration: 'none',
}));

export const FeatureCardCtaLabel = styled(Typography)(() => ({
  maxWidth: 224,
  maxHeight: 20,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));
