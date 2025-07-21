'use client';
import { Box, Card, CardActionArea, CardContent } from '@mui/material';

import { styled } from '@mui/material/styles';
import Image from 'next/image';

export const PerksCardContainer = styled(Card)(({ theme }) => ({
  width: 296,
  height: 396,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  '&:hover': {
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @todo FIGMA: should be applied as elevation 4
  },
}));

export const PerksCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'flex-start',
  padding: theme.spacing(3),
  width: '100%',
  gap: theme.spacing(2),
  '.badge-container': {
    flexShrink: 0,
  },
}));

export const PerksCardBadgeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  flexShrink: 0,
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  maxWidth: '100%',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: 'auto',
}));

export const PerksCardActionArea = styled(CardActionArea)(() => ({
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

export const PerksCardImage = styled(Image)(({ theme }) => ({
  width: '100%',
  aspectRatio: '2/1',
  objectFit: 'cover',
  justifySelf: 'center',
}));
