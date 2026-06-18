import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const SWIPER_SHADOW_SPACING = 8;

export const CarouselColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const CarouselViewport = styled(Box)(() => ({
  position: 'relative',
  boxSizing: 'content-box',
  minWidth: 0,
}));

export const sectionCarouselNavButtonSx =
  (side: 'left' | 'right') => (theme: Theme) => ({
    position: 'absolute',
    top: '50%',
    [side]: `${SWIPER_SHADOW_SPACING}px`,
    transform: `translate(${side === 'left' ? '-50%' : '50%'}, -50%)`,
    zIndex: 2,
    border: `${theme.spacing(0.5)} solid ${(theme.vars || theme).palette.surface2.main}`,
  });

export const CarouselControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('lg')]: {
    justifyContent: 'flex-end',
  },
}));

export const CarouselDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const CarouselDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  width: theme.spacing(1),
  height: theme.spacing(1),
  borderRadius: theme.shape.radiusRoundedFull,
  cursor: 'pointer',
  backgroundColor: active
    ? (theme.vars || theme).palette.accent1.main
    : (theme.vars || theme).palette.alpha300.main,
}));
