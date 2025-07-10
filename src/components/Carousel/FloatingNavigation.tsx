'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  FloatingNavigationButton,
  FloatingNavigationContainer,
} from './Carousel.style';
import { CarouselNavigationBase } from './Carousel.types';

export const FloatingNavigation = ({ classNames }: CarouselNavigationBase) => {
  return (
    <FloatingNavigationContainer>
      <FloatingNavigationButton
        aria-label="previous"
        className={classNames.navigationPrev}
        sx={{
          marginLeft: 0.5,
        }}
      >
        <ArrowBackIcon sx={{ width: '24px', height: '24px' }} />
      </FloatingNavigationButton>
      <FloatingNavigationButton
        aria-label="next"
        className={classNames.navigationNext}
        sx={{
          marginRight: 0.5,
        }}
      >
        <ArrowForwardIcon sx={{ width: '24px', height: '24px' }} />
      </FloatingNavigationButton>
    </FloatingNavigationContainer>
  );
};
