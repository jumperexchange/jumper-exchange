'use client';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

export const AchievementCardContainer = styled(Card)(({ theme, onClick }) => ({
  borderRadius: theme.shape.cardBorderRadius,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.lavenderLight[0],
  }),
  boxShadow: theme.shadows[2],
  width: 296,
  height: 420,
  cursor: onClick ? 'pointer' : 'default',
  '&:hover': {
    boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.08)',
  },
}));

export const AchievementCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  width: '100%',
  gap: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.lavenderLight[0],
  }),
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
  ...getTextEllipsisStyles(1),
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

// Image

export const StyledAchievementCardImage = styled(Image)(({ theme }) => ({
  objectFit: 'cover',
  objectPosition: 'center',
  aspectRatio: '1 / 1',
  height: '100%',
  width: '100%',
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

// Skeletons

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
