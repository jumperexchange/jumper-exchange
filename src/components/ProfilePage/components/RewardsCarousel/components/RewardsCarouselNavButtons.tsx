'use client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { useRewardsCarouselContext } from '../RewardsCarouselContext';

export const RewardsCarouselNavButtons = () => {
  const { navState, classNames } = useRewardsCarouselContext();

  return (
    <>
      <IconButton
        aria-label="previous"
        className={classNames.navigationPrev}
        disabled={navState.isBeginning}
        sx={(theme) => ({
          pointerEvents: navState.isBeginning ? 'none' : 'auto',
          zIndex: 1,
          [theme.breakpoints.up('sm')]: {
            marginBottom: theme.spacing(1.5),
            visibility: navState.isBeginning ? 'hidden' : 'visible',
          },
        })}
      >
        <ArrowBackIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
      <IconButton
        aria-label="next"
        className={classNames.navigationNext}
        disabled={navState.isEnd}
        sx={(theme) => ({
          pointerEvents: navState.isEnd ? 'none' : 'auto',
          zIndex: 1,
          [theme.breakpoints.up('sm')]: {
            marginBottom: theme.spacing(1.5),
            visibility: navState.isEnd ? 'hidden' : 'visible',
          },
        })}
      >
        <ArrowForwardIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
    </>
  );
};
