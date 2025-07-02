import { useTranslation } from 'react-i18next';
// import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import { useTheme } from '@mui/material';
import { Carousel } from 'src/components/Carousel/Carousel';
import { AvailableRewardsExtended } from 'src/types/merkl';
import { ClaimingBox } from './ClaimingBox/ClaimingBox';
import {
  RewardsCarouselContainer,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
interface RewardsCarouselProps {
  isMerklSuccess: boolean;
  availableRewards: AvailableRewardsExtended[];
}

// -------
//TESTING
// const TEST_TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const RewardsCarousel = ({
  availableRewards,
  isMerklSuccess,
}: RewardsCarouselProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const rewardsWithAmount = availableRewards.filter(
    (reward) => reward.amountToClaim > 0 && isMerklSuccess,
  );

  if (rewardsWithAmount.length === 0) {
    return null;
  }

  const items = rewardsWithAmount.map((availableReward, i) => (
    <ClaimingBox
      key={`${i}-${availableReward.address}`}
      amount={availableReward.amountToClaim}
      availableReward={availableReward}
    />
  ));

  return (
    <RewardsCarouselContainer rewardsLength={rewardsWithAmount.length}>
      <RewardsCarouselTitle variant="titleSmall">
        {t('profile_page.rewards')}
      </RewardsCarouselTitle>
      <Carousel
        hasNavigation={false}
        fixedSlideWidth={true}
        sx={{
          '.carousel-swiper': {
            marginTop: 0,
            paddingBottom: 0,
          },
          marginTop: theme.spacing(2),
          [theme.breakpoints.up('md')]: {
            marginTop: 0,
          },
        }}
      >
        {items}
      </Carousel>
    </RewardsCarouselContainer>
  );
};
