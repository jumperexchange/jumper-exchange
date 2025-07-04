import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  CarouselNavigationButton,
  CarouselNavigationContainer,
} from './Carousel.style';

export interface CarouselNavigationProps {
  classNames: {
    navigationPrev: string;
    navigationNext: string;
  };
}

export const CarouselNavigation = ({ classNames }: CarouselNavigationProps) => {
  console.log('classNames', classNames);
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
