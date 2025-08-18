'use client';
import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

interface PerksCardContainerProps extends CardProps {
  disabled?: boolean;
}

export const PerksCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<PerksCardContainerProps>(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: (theme.vars || theme).palette.surface3.main,
  overflow: 'hidden',
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.lavenderLight[0],
  }),
  '&:hover': {
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @todo FIGMA: should be applied as elevation 4
  },
  variants: [
    {
      props: ({ disabled }) => !!disabled,
      style: {
        opacity: 0.5,
        cursor: 'not-allowed !important',
      },
    },
  ],
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
  backgroundColor: (theme.vars || theme).palette.surface3.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.lavenderLight[0],
  }),
}));

// Skeletons

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));
