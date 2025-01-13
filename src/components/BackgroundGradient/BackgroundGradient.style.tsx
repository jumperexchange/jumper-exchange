'use client';
import type { Breakpoint, Theme } from '@mui/material/styles';
import { alpha, darken, styled } from '@mui/material/styles';

export interface BackgroundGradientContainerProps {
  backgroundImageUrl?: URL;
  backgroundColor?: string;
}

export const BackgroundGradientContainer = styled('div', {
  shouldForwardProp: (prop) =>
    prop !== 'backgroundImageUrl' && prop !== 'backgroundColor',
})<BackgroundGradientContainerProps>(({
  theme,
  backgroundImageUrl,
  backgroundColor,
}) => {
  return {
    position: 'fixed',
    overflow: 'hidden',
    pointerEvents: 'none',
    background: (theme as Theme).palette.surface1.main,
    backgroundColor: backgroundColor,
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    zIndex: -1,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
    variants: [
      {
        props: ({ backgroundImageUrl }) => backgroundImageUrl,
        style: {
          background: backgroundImageUrl
            ? `url(${backgroundImageUrl.href})`
            : (theme as Theme).palette.surface1.main,
        },
      },
      {
        props: ({ backgroundImageUrl }) => backgroundImageUrl,
        style: { backgroundSize: 'cover' },
      },
    ],
  };
});

const BackgroundGradient = styled('span')(() => ({
  content: '" "',
  position: 'absolute',
  width: '100vh',
  height: '100vh',
  opacity: '0.12',
}));

export const BackgroundGradients = styled('span')(({ theme }) => ({
  width: '100vh',
  height: '100vh',
  opacity: '0.12',
  transform: 'translate(0%,-50%) scale(1.5)',
  background:
    'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(255, 255, 255, 0) 100%)',
  ':before': {
    content: '" "',
    width: '100vh',
    height: '100vh',
    transform: undefined,
    opacity: '0.12',
    background:
      'radial-gradient(50% 50% at 50% 50%, #1969FF 0%, rgba(255, 255, 255, 0) 100%)',
    ...theme.applyStyles('dark', {
      transform: 'translate( -50vh, 100vh ) scale(1.5)',
      opacity: '0.24',
    }),
  },
  ':after': {
    content: '" "',
    position: 'absolute',
    width: '100vh',
    height: '100vh',
    transform: 'translate(50%,50%) scale(1.5)',
    right: 0,
    bottom: 0,
    opacity: '0.12',
    background:
      'radial-gradient(50% 50% at 50% 50%, #E1147B 0%, rgba(255, 255, 255, 0) 100%)',
    ...theme.applyStyles('dark', {
      opacity: '0.24',
    }),
  },
  ...theme.applyStyles('dark', {
    width: '100vw',
    height: '100vw',
    opacity: '0.24',
    transform: 'translate(-0%, -50%) scale( calc( 1 + 1 / 3 ))',
  }),
}));

export const BackgroundGradientBottomLeft = styled(BackgroundGradient)(
  ({ theme }) => ({
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      display: 'none',
    },
    transform: 'translate(-50%,50%) scale(1.5)',
    left: 0,
    opacity: '0.16',
    bottom: 0,
    background:
      'radial-gradient(50% 50% at 50% 50%, #BB00FF 0%, rgba(255, 255, 255, 0) 100%)',
    ...theme.applyStyles('dark', {
      opacity: '0.24',
    }),
  }),
);

export const BackgroundGradientBottomRight = styled(BackgroundGradient)(
  ({ theme }) => ({
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      display: 'none',
    },
    transform: 'translate(50%,50%) scale(1.5)',
    right: 0,
    bottom: 0,
    opacity: '0.16',
    background:
      'radial-gradient(50% 50% at 50% 50%, #0044FF 0%, rgba(255, 255, 255, 0) 100%)',
    ...theme.applyStyles('dark', {
      opacity: '0.24',
    }),
  }),
);

export const BackgroundGradientTopCenter = styled(BackgroundGradient)(
  ({ theme }) => ({
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      display: 'none',
    },
    transform: 'translate(-50%, -50%) scale(1.5)',
    top: 0,
    left: '50%',
    width: '100vh',
    height: '100vh',
    opacity: '0.12',
    background:
      'radial-gradient(50% 50% at 50% 50%, #8800FF 0%, rgba(255, 255, 255, 0) 100%)',
    ...theme.applyStyles('dark', {
      transform: 'translate(-50%, -50%) scale( calc( 1 + 1 / 3 ))',
      width: '100vw',
      height: '100vw',
      opacity: '0.24',
    }),
  }),
);

export const BlogBackgroundGradient = styled(BackgroundGradient)(
  ({ theme }) => ({
    transform: 'translateX(-50%)',
    top: -200,
    left: '50%',
    position: 'fixed',
    opacity: 1,
    width: '100%',
    height: 'calc( 100vh + 200px )',
    zIndex: -1,
    background: `linear-gradient(180deg, rgba(3, 0, 20, 1) 0%, ${darken('#9747FF', 0.6)} 150%)`,
    ...theme.applyStyles('light', {
      position: 'absolute',
      background: `linear-gradient(180deg, ${alpha(theme.palette.bg.main, 1)} 0%, ${alpha(theme.palette.bg.main, 0)} 100%)`,
    }),
  }),
);

export const SuperfestBackgroundContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  backgroundRepeat: 'repeat',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${process.env.NEXT_PUBLIC_STRAPI_URL}/uploads/Superfest_OP_9e52e7917e.svg)`,
  overflow: 'hidden',
  pointerEvents: 'none',
  left: 0,
  bottom: 0,
  right: 0,
  top: 0,
  zIndex: -1,
}));
