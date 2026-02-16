import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { cardClasses } from '@mui/material/Card';
import { Button } from '@/components/core/buttons/Button/Button';

export const PercentagesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: theme.zIndex.drawer,
}));

export const PercentageButton = styled(Button)(({ theme }) => ({
  opacity: 0,
  transform: 'scale(0.85) translateY(-10px)',
  transition:
    'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '&[data-delay="0"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '75ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '0ms',
    },
  },
  '&[data-delay="1"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '50ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '25ms',
    },
  },
  '&[data-delay="2"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '25ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '50ms',
    },
  },
  '&[data-delay="3"]': {
    [`.${cardClasses.root}:hover &`]: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
      transitionDelay: '0ms',
    },
    [`.${cardClasses.root}:not(:hover) &`]: {
      opacity: 0,
      transform: 'scale(0.85) translateY(-10px)',
      transitionDelay: '75ms',
    },
  },
}));
