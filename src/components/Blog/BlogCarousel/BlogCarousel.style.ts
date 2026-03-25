'use client';

import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'motion/react';

export const CARD_GAP = 24;
export const FALLBACK_CARD_WIDTH = 416;
export const FALLBACK_CARD_HEIGHT = 416;
export const FALLBACK_SLOT = FALLBACK_CARD_WIDTH + CARD_GAP;
export const STACK_PEEK_PX = 14;

export const NAV_SPRING = {
  type: 'spring',
  stiffness: 300,
  damping: 32,
} as const;
export const SPREAD_SPRING = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
} as const;

export const BlogCarouselContainer = styled(MuiContainer)(({ theme }) => ({
  position: 'relative',
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  border: getSurfaceBorder(theme, 'surface2'),
  borderRadius: theme.shape.cardBorderRadiusXLarge,
  boxShadow: (theme.vars || theme).shadows[2],
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1.25),
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(2.25),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3.25),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(6),
    paddingBottom: theme.spacing(5.25),
  },
}));

export const CarouselViewport = styled('div')({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  padding: '16px 0 32px',
});

export const DraggableRow = styled(motion.div)({
  display: 'flex',
  alignItems: 'start',
  cursor: 'grab',
  '&:active': { cursor: 'grabbing' },
  userSelect: 'none',
});
