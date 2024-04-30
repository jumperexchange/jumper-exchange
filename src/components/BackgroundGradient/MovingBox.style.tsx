import { Box, BoxProps, styled } from '@mui/material';

export const MovingBox = styled(Box)<BoxProps>(() => ({
  // put in the bottom left and put a percentage of the screen of 10%
  position: 'absolute',
  bottom: '1vh',
  animation: 'slideEffect 60s linear infinite',
  transition: 'transform 1s ease',
  animationPlayState: 'running',
  opacity: 0.5,
  '&:hover': {
    opacity: 1,
    animationPlayState: 'paused',
    transform: 'scale(1.2)',
    transformOrigin: 'bottom center',
  },
  '@keyframes slideEffect': {
    '0%': {
      left: '0%',
    },
    '100%': {
      left: '100%',
    },
  },
}));

export const FixBoxWithNoOverflow = styled(Box)<BoxProps>(() => ({
  position: 'fixed',
  overflow: 'hidden',
  left: 0,
  bottom: 0,
  right: 0,
  top: 0,
  zIndex: 1,
}));
