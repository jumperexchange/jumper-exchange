import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import type { AvailableRewards } from 'src/hooks/useMerklRewardsOnCampaigns';
import { ClaimingBox } from './ClaimingBox/ClaimingBox';
import {
  EarnedTypography,
  RewardsCarouselContainer,
} from './RewardsCarousel.style';

interface RewardsCarouselProps {
  isMerklSuccess: boolean;
  hideComponent: boolean;
  availableRewards: AvailableRewards[];
}

// -------
//TESTING
// const TEST_TOKEN = '0x41A65AAE5d1C8437288d5a29B4D049897572758E';

export const RewardsCarousel = ({
  availableRewards,
  hideComponent,
  isMerklSuccess,
}: RewardsCarouselProps) => {
  const { t } = useTranslation();
  return (
    !hideComponent && (
      <RewardsCarouselContainer>
        <FlexCenterRowBox>
          <Box>
            <EarnedTypography
              sx={(theme) => ({
                color: theme.palette.text.primary,
              })}
            >
              {t('profile_page.rewards')}
            </EarnedTypography>
          </Box>
        </FlexCenterRowBox>
        {availableRewards.map((availableReward, i) => {
          const amount = availableReward.amountToClaim;
          return (
            <Box key={i + availableReward.address}>
              {amount > 0 && isMerklSuccess && (
                <ClaimingBox
                  amount={amount}
                  availableReward={availableReward}
                />
              )}
            </Box>
          );
        })}
      </RewardsCarouselContainer>
    )
  );
};
