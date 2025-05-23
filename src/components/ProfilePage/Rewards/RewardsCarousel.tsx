import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import type { AvailableRewards } from 'src/hooks/useMerklRewards';
import { ClaimingBox } from './ClaimingBox/ClaimingBox';
import {
  RewardsCarouselContainer,
  RewardsCarouselItems,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';

interface RewardsCarouselProps {
  isMerklSuccess: boolean;
  availableRewards: AvailableRewards[];
}

// -------
//TESTING
// const TEST_TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const RewardsCarousel = ({
  availableRewards,
  isMerklSuccess,
}: RewardsCarouselProps) => {
  const { t } = useTranslation();

  const rewardsWithAmount = availableRewards.filter(
    (reward) => reward.amountToClaim > 0 && isMerklSuccess,
  );

  if (rewardsWithAmount.length === 0) {
    return null;
  }

  return (
    <RewardsCarouselContainer rewardsLength={rewardsWithAmount.length}>
      <RewardsCarouselTitle variant="titleSmall">
        {t('profile_page.rewards')}
      </RewardsCarouselTitle>

      <CarouselContainer
        hidePagination={true}
        sx={{ marginTop: 0, paddingBottom: 0 }}
      >
        <RewardsCarouselItems>
          {rewardsWithAmount.map((availableReward, i) => (
            <ClaimingBox
              key={`${i}-${availableReward.address}`}
              amount={availableReward.amountToClaim}
              availableReward={availableReward}
            />
          ))}
        </RewardsCarouselItems>
      </CarouselContainer>
    </RewardsCarouselContainer>
  );
};
