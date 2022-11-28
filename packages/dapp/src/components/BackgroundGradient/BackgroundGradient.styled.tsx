import { styled } from '@mui/material/styles';

export const BackgroundGradientContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  overflow: 'hidden',
  pointerEvents: 'none',
  background: `${theme.palette.background.default}`,
  height: '100vh',
  width: '100vw',
  left: 0,
  bottom: 0,
  right: 0,
  top: 0,
  '*:not(.background-gradient)': {
    pointerEvents: 'all',
  },
}));

export const BackgroundGradient = styled('span')(({ theme }) => ({
  content: '""',
  position: 'absolute',
  width: '100vh',
  height: '100vh',
  opacity: '0.08',
}));

export const BackgroundGradientBottomLeft = styled(BackgroundGradient)(
  ({ theme }) => ({
    transform: 'translate(-50%,50%) scale(1.5)',
    left: 0,
    bottom: 0,
    background:
      'radial-gradient(50% 50% at 50% 50%, #1969FF 0%, rgba(255, 255, 255, 0) 100%)',
  }),
);

export const BackgroundGradientBottomRight = styled(BackgroundGradient)(
  ({ theme }) => ({
    transform: 'translate(50%,50%) scale(1.5)',
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(50% 50% at 50% 50%, #E1147B 0%, rgba(255, 255, 255, 0) 100%)',
  }),
);

export const BackgroundGradientTopCenter = styled(BackgroundGradient)(
  ({ theme }) => ({
    transform: 'translate(-50%,-50%) scale(1.5)',
    top: 0,
    left: '50%',
    background:
      'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(255, 255, 255, 0) 100%)',
  }),
);
