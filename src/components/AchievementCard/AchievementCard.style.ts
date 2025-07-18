'use client';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, Card, CardActionArea, CardContent } from '@mui/material';

import { alpha, styled } from '@mui/material/styles';
import Image from 'next/image';

export const AchievementCard = styled(Card)(({ theme }) => ({
  width: 296,
  height: 420,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  margin: theme.spacing(2), // this allows the box-shadow to be visible inside the carousel
  '&:hover': {
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @todo FIGMA: should be applied as elevation 4
  },
}));

export const AchievementCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  flexGrow: 1,
  width: '100%',
}));

export const AchievementCardLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexShrink: 0,
  justifyContent: 'space-between',
  gap: 1,
  marginRight: theme.spacing(1),
  maxWidth: 'calc(100% - 64px)', // keep space for badge
  overflow: 'hidden', // hide overflowed text if title is too long
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
  height: 320,
  aspectRatio: '1/1',
  objectFit: 'cover',
  justifySelf: 'center',
}));

export const AchievementCardVoidImage = styled(Box)(({ theme }) => ({
  height: 96,
  width: 96,
  color: alpha(theme.palette.grey[400], 0.08),
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[400],
  }),
}));

export const VoidIcon = styled(QuestionMarkIcon)(({ theme }) => ({
  height: 96,
  width: 96,
  color: (theme.vars || theme).palette.black.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.white.main,
  }),
}));
