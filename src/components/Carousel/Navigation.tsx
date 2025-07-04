import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from './Carousel.style';
import { CarouselNavigationBase } from './Carousel.types';

export const CarouselNavigation = ({ classNames }: CarouselNavigationBase) => {
  return (
    <CarouselNavigationContainer>
      <CarouselNavigationButton
        aria-label="previous"
        className={classNames.navigationPrev}
      >
        <ChevronLeftIcon sx={{ width: '24px', height: '24px' }} />
      </CarouselNavigationButton>
      <CarouselNavigationButton
        aria-label="next"
        className={classNames.navigationNext}
        sx={{
          marginLeft: 1,
        }}
      >
        <ChevronRightIcon sx={{ width: '24px', height: '24px' }} />
      </CarouselNavigationButton>
    </CarouselNavigationContainer>
  );
};
