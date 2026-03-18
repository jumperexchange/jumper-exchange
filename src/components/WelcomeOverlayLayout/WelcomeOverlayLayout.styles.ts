import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { DEFAULT_WELCOME_SCREEN_HEIGHTS } from '../WelcomeScreen/WelcomeScreen.style';

const GLOW_EFFECT_TOP_POSITIONS = {
  xs: '40%',
  md: '50%',
} as const;

const GLOW_EFFECT_TOP_OFFSET_POSITION = '5%';

interface GlowContainerProps {
  overlayOpen: boolean;
  fullWidthGlowEffect: boolean;
}

export const GlowContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'overlayOpen' && prop !== 'fullWidthGlowEffect',
})<GlowContainerProps>(({ theme, overlayOpen, fullWidthGlowEffect }) => {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    transitionProperty: 'max-height',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    [theme.breakpoints.up('sm')]: {
      width: fullWidthGlowEffect ? '100%' : 'auto',
    },
    [theme.breakpoints.up('lg')]: {
      margin: fullWidthGlowEffect ? 0 : theme.spacing(0, 4),
    },
    '&:after': {
      content: '" "',
      visibility: 'hidden',
      transitionProperty: 'top, opacity',
      transitionDuration: '.4s',
      transitionTimingFunction: 'ease-in-out',
      background: `radial-gradient(50% 50% at 50% 50%, ${(theme.vars || theme).palette.bgGlow1} 0%, rgba(255, 255, 255, 0) 100%);`,
      opacity: overlayOpen ? 0.48 : 0,
      zIndex: -1,
      pointerEvents: 'none',
      width: 1080,
      height: 1080,
      position: 'fixed',
      maxWidth: 'calc( 416px * 2 )',
      maxHeight: 'calc( 416px * 2 )',
      transform: 'translate(-50%, -50%)',
      left: '50%',
      top: GLOW_EFFECT_TOP_POSITIONS.xs,
      [theme.breakpoints.up('md')]: {
        top: GLOW_EFFECT_TOP_POSITIONS.md,
      },
      [theme.breakpoints.up('lg')]: {
        maxWidth: '90vh',
        maxHeight: '90vh',
      },
      ...theme.applyStyles('light', {
        opacity: overlayOpen ? 1 : 0,
        background: `radial-gradient(50% 50% at 50% 50%, ${(theme.vars || theme).palette.bgGlow2} 0%, rgba(255, 255, 255, 0) 100%);`,
      }),
    },
    variants: [
      {
        props: ({ overlayOpen }) => overlayOpen,
        style: {
          minHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.xs,
          maxHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.xs,
          [theme.breakpoints.up('sm')]: {
            minHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.md,
            maxHeight: DEFAULT_WELCOME_SCREEN_HEIGHTS.md,
          },
        },
      },
      {
        props: ({ overlayOpen }) => !overlayOpen,
        style: {
          [theme.breakpoints.up('lg')]: {
            marginRight: fullWidthGlowEffect
              ? 0
              : `calc( ${theme.spacing(4)} + 56px )`,
          },
        },
      },
      {
        props: ({ overlayOpen }) => overlayOpen,
        style: {
          '&:after': {
            visibility: 'visible',
          },
        },
      },
      {
        props: ({ overlayOpen }) => overlayOpen,
        style: {
          '&:hover:after': {
            opacity: 0.48,
            ...theme.applyStyles('light', {
              opacity: 1,
            }),
            top: `calc( ${GLOW_EFFECT_TOP_POSITIONS.xs} + ${GLOW_EFFECT_TOP_OFFSET_POSITION})`,
            [theme.breakpoints.up('md')]: {
              top: `calc( ${GLOW_EFFECT_TOP_POSITIONS.md} + ${GLOW_EFFECT_TOP_OFFSET_POSITION})`,
            },
          },
        },
      },
    ],
  };
});
