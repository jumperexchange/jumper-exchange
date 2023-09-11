import {
  CardMedia,
  CardMediaProps,
  Card as MuiCard,
  CardProps as MuiCardProps,
} from '@mui/material';

import { styled } from '@mui/material/styles';

export interface CardProps extends Omit<MuiCardProps, 'component'> {
  gradient?: string;
}

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'gradient',
})<CardProps>(({ theme, gradient }) => ({
  width: 384,
  height: 160,
  borderRadius: '12px',
  position: 'relative',
  marginBottom: theme.spacing(3),
  overflow: 'hidden',
  background: `radial-gradient(circle at 506px 437px, ${
    gradient ? gradient : '#3F49E1'
  } -43%, ${
    theme.palette.mode === 'dark' ? '#20223D' : '#FFFFFF'
  } 506px 349px)`,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  ':last-child': {
    marginBottom: 0,
  },
}));

export interface CardImageProps extends Omit<CardMediaProps, 'component'> {
  component?: string;
  alt?: string;
  src?: string;
}

export const CardImage = styled(CardMedia)<CardImageProps>(({ theme }) => ({
  width: '106px',
  maxWidth: '160px',
  height: 'auto',
  maxHeight: '160px',
  position: 'absolute',
  objectFit: 'contain',
  right: theme.spacing(9),
  bottom: theme.spacing(7),
}));
