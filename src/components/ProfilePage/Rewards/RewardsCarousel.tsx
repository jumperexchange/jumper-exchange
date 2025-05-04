import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog/BlogCarousel/CarouselContainer';
import type { AvailableRewards } from 'src/hooks/useMerklRewards';
import { ClaimingBox } from './ClaimingBox/ClaimingBox';
import {
  RewardsCarouselContainer,
  RewardsCarouselItems,
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
      <Typography
        variant="titleSmall"
        sx={(theme) => ({
          color: theme.palette.text.primary,
          [theme.breakpoints.up('md')]: {
            width: '140px',
          },
        })}
      >
        {t('profile_page.rewards')}
      </Typography>

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
