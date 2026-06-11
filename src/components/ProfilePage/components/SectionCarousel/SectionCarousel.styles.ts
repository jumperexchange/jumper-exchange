import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const CarouselColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  // Lets the Swiper compute available width inside the grid/flex cell.
  minWidth: 0,
}));

// Relative wrapper so the nav buttons can sit centered on the carousel edges
// (its overflow stays visible so the straddling buttons aren't clipped; the
// Swiper clips its own slides).
export const CarouselViewport = styled(Box)(() => ({
  position: 'relative',
  minWidth: 0,
}));

// Nav button centered on the left/right edge of the carousel, with the Figma
// "halo": a 4px surface-2 ring around the light button (no edge fade).
export const carouselNavButtonSx =
  (side: 'left' | 'right') => (theme: Theme) => ({
    position: 'absolute',
    top: '50%',
    [side]: 0,
    transform: `translate(${side === 'left' ? '-50%' : '50%'}, -50%)`,
    zIndex: 2,
    border: `${theme.spacing(0.5)} solid ${(theme.vars || theme).palette.surface2.main}`,
  });

// --- Carousel controls (Showing X of Y + dots) ---

export const CarouselControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2),
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
