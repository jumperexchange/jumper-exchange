'use client';
import type {
  LinkProps,
  CardProps as MuiCardProps,
  TypographyProps,
} from '@mui/material';
import {
  CardActions,
  CardContent,
  IconButton,
  Link,
  Card as MuiCard,
  Typography,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { inter } from 'src/fonts/fonts';
import type { FeatureCardData } from 'src/types/strapi';

export interface CardProps extends Omit<MuiCardProps, 'component'> {
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
  borderRadius: '12px',
  position: 'relative',
  marginBottom: theme.spacing(1.5),
  overflow: 'hidden',
  backgroundImage: `url(${backgroundImageUrl}), radial-gradient(circle at 506px 437px, #3F49E1 -43%, ${
    isDarkCard || theme.palette.mode === 'light'
      ? theme.palette.white.main
      : '#20223D'
  } 506px 349px)`,
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

export interface FeatureCardTitleProps
  extends Omit<TypographyProps, 'component'> {
  data?: FeatureCardData;
  typographyColor?: string;
}

export const FeatureCardTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'data' && prop !== 'typographyColor',
})<FeatureCardTitleProps>(({ typographyColor, data }) => ({
  color: data?.attributes?.TitleColor ?? typographyColor,
  fontSize: '24px',
  lineHeight: '32px',
  userSelect: 'none',
  maxHeight: 32,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export interface FeatureCardSubtitleProps
  extends Omit<TypographyProps, 'component'> {
  typographyColor?: string;
}

export const FeatureCardSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'typographyColor',
})<FeatureCardSubtitleProps>(({ typographyColor }) => ({
  color: typographyColor,
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

export interface FeatureCardCtaLinkProps extends Omit<LinkProps, 'component'> {
  data: FeatureCardData;
}

export const FeatureCardCtaLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'data',
})<FeatureCardCtaLinkProps>(({ theme, data }) => ({
  textDecoration: 'none',
  color:
    data.attributes?.DisplayConditions.mode === 'dark' ||
    theme.palette.mode === 'light'
      ? theme.palette.primary?.main
      : theme.palette.accent1Alt.main,
}));

export interface FeatureCardCtaLabelProps
  extends Omit<TypographyProps, 'component'> {
  data: FeatureCardData;
  typographyColor?: string;
}

export const FeatureCardCtaLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'data' && prop !== 'typographyColor',
})<FeatureCardCtaLabelProps>(({ data, typographyColor }) => ({
  maxWidth: 224,
  maxHeight: 20,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: data.attributes?.CTAColor ?? 'inherit',
}));
