import type { Breakpoint } from '@mui/material/styles';
import { alpha, darken, styled } from '@mui/material/styles';

export interface BackgroundGradientContainerProps {
  backgroundImageUrl?: URL;
  backgroundColor?: string;
}

// Constants
const RADIAL_TRANSPARENT = 'rgba(255, 255, 255, 0)';

const radialGradient = (color: string) =>
  `radial-gradient(50% 50% at 50% 50%, ${color} 0%, ${RADIAL_TRANSPARENT} 100%)`;

const gradientBase = {
  content: '" "',
  position: 'absolute',
  width: 480,
  height: 480,
  opacity: '0.12',
  borderRadius: '50%',
} as const;

export const BackgroundGradientContainer = styled('div', {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundImageUrl' && prop !== 'backgroundColor',
})<BackgroundGradientContainerProps>(
  ({ theme, backgroundImageUrl, backgroundColor }) => ({
    position: 'fixed',
    overflow: 'hidden',
    pointerEvents: 'none',
    background: theme.palette.surface1.main,
    backgroundColor,
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    zIndex: -1,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    ...(backgroundImageUrl && {
      background: `url(${backgroundImageUrl.href})`,
      backgroundSize: 'cover',
    }),
  }),
);

export const BackgroundGradients = styled('span')(({ theme }) => ({
  width: '100vh',
  height: '100vh',
  opacity: '0.12',
  transform: 'translate(0%,-50%) scale(1.5)',
  background: radialGradient('#9747FF'),
  ':before': {
    content: '" "',
    width: '100vh',
    height: '100vh',
    transform: 'translate(-50vh, 100vh) scale(1.5)',
    opacity: '0.24',
    background: radialGradient('#1969FF'),
    ...theme.applyStyles('light', {
      transform: undefined,
      opacity: '0.12',
    }),
  },
  ':after': {
    content: '" "',
    position: 'absolute',
    width: '100vw',
    height: '100vw',
    transform: 'translate(-0%, -50%) scale(calc(1 + 1 / 3))',
    right: 0,
    bottom: 0,
    opacity: '0.24',
    background: radialGradient('#E1147B'),
    ...theme.applyStyles('light', {
      width: '100vh',
      height: '100vh',
      transform: 'translate(50%, 50%) scale(1.5)',
      opacity: '0.12',
    }),
  },
}));

export const BackgroundGradientBottomLeft = styled('span')(({ theme }) => {
  const t = theme.vars || theme;
  return {
    ...gradientBase,
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      display: 'none',
    },
    transformOrigin: 'center center',
    transform: 'translate(-50%, 50%)',
    position: 'fixed',
    left: 0,
    bottom: 0,
    opacity: 1,
    background: radialGradient(t.palette.bgGlow2),
  };
});

export const BackgroundGradientBottomRight = styled('span')(({ theme }) => {
  const t = theme.vars || theme;
  return {
    ...gradientBase,
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      display: 'none',
    },
    transformOrigin: 'center center',
    transform: 'translate(50%, 50%)',
    position: 'fixed',
    right: 0,
    bottom: 0,
    opacity: 1,
    background: radialGradient(t.palette.bgGlow2),
  };
});

export const BackgroundGradientTopCenter = styled('span')(({ theme }) => ({
  ...gradientBase,
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    display: 'none',
  },
  transform: 'translate(-50%, -50%) scale(calc(1 + 1 / 3))',
  top: 0,
  left: '50%',
  width: '100vw',
  height: '100vw',
  opacity: '0.24',
  background: radialGradient('#8800FF'),
  ...theme.applyStyles('light', {
    transform: 'translate(-50%, -50%) scale(1.5)',
    width: '100vh',
    height: '100vh',
    opacity: '0.12',
  }),
}));

export const BlogBackgroundGradient = styled('span')(({ theme }) => ({
  ...gradientBase,
  transform: 'translateX(-50%)',
  top: -200,
  left: '50%',
  position: 'absolute',
  opacity: 1,
  width: '100%',
  height: 'calc(100vh + 200px)',
  zIndex: -1,
  background: `linear-gradient(180deg, ${alpha(theme.palette.bg.main, 1)} 0%, ${alpha(theme.palette.bg.main, 0)} 100%)`,
  ...theme.applyStyles('light', {
    position: 'fixed',
    backgroundColor: (theme.vars || theme).palette.bg.main,
    background: `linear-gradient(180deg, rgba(3, 0, 20, 1) 0%, ${darken('#9747FF', 0.6)} 150%)`,
  }),
}));
