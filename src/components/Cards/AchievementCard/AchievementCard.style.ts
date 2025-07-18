'use client';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const AchievementCardContainer = styled(Card)(({ theme }) => ({
  width: 296,
  height: 420,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  '&:hover': {
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @todo FIGMA: should be applied as elevation 4
  },
}));

export const AchievementCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  width: '100%',
  gap: theme.spacing(1),
  '.badge-container': {
    flexShrink: 0,
  },
}));

export const AchievementCardLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexShrink: 0,
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 'auto',
}));

export const AchievementCardTypography = styled(Typography)(() => ({
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const AchievementCardActionArea = styled(CardActionArea)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  '& .MuiCardActionArea-focusHighlight': {
    background: 'transparent',
  },
}));

export const AchievementCardImage = styled(Image)(({ theme }) => ({
  width: '100%',
  aspectRatio: '1/1',
  objectFit: 'cover',
  justifySelf: 'center',
}));
