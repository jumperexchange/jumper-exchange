import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const blurEdge = (direction: 'left' | 'right', color: string) => ({
  content: '""',
  position: 'absolute',
  top: 0,
  [direction]: 0,
  width: '80px',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  background: `linear-gradient(to ${direction === 'left' ? 'right' : 'left'}, ${color}, transparent)`,
});

export const RewardsCarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(-2),
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, -2, -2, -2),
  },
}));

export const RewardsCarouselNavigationContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pointerEvents: 'none',

  '&::before': {
    ...blurEdge('left', (theme.vars || theme).palette.surface2.main),
  },
  '&::after': {
    ...blurEdge('right', (theme.vars || theme).palette.surface2.main),
  },

  '&[data-show-left="true"]::before': {
    opacity: 1,
  },
  '&[data-show-right="true"]::after': {
    opacity: 1,
  },
}));
