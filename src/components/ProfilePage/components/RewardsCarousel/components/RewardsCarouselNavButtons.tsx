'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { carouselNavButtonSx } from '../RewardsCarousel.style';
import { useRewardsCarouselContext } from '../RewardsCarouselContext';

export const RewardsCarouselNavButtons = () => {
  const { navState, classNames } = useRewardsCarouselContext();

  return (
    <>
      <IconButton
        aria-label="previous"
        className={classNames.navigationPrev}
        disabled={navState.isBeginning}
        sx={carouselNavButtonSx(navState.isBeginning)}
      >
        <ArrowBackIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
      <IconButton
        aria-label="next"
        className={classNames.navigationNext}
        disabled={navState.isEnd}
        sx={carouselNavButtonSx(navState.isEnd)}
      >
        <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
    </>
  );
};
