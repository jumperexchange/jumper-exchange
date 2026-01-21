'use client';

import { useTranslation } from 'react-i18next';
import {
  RewardsSectionContentContainer,
  RewardsSectionContainer,
} from './Section.style';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { useMerklRewards } from '@/hooks/rewards/useMerklRewards';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { RewardsCarousel } from '../components/RewardsCarousel/RewardsCarousel';
import { RewardClaimCardSkeleton } from '../components/RewardsCarousel/components/RewardClaimCardSkeleton';
import type { MerklRewardsData } from 'src/types/strapi';
import { MerklRewardClaim } from '../components/RewardsCarousel/components/MerklRewardClaim';
import { DefiReacherRewardClaim } from '../components/RewardsCarousel/components/DefiReacherRewardClaim';
import { useDeFiReacherRewards } from '@/hooks/rewards/useDeFiReacherRewards';

export const RewardsSection = ({
  merklRewards,
}: {
  merklRewards: MerklRewardsData[] | undefined;
}) => {
  const { t } = useTranslation();
  const { walletAddress: address } = useContext(ProfileContext);

  const {
    availableRewards: merklAvailableRewards,
    isSuccess: isMerklSuccess,
    isLoading: isMerklLoading,
  } = useMerklRewards({
    userAddress: address,
    claimableOnly: true,
    merklRewards,
  });

  const {
    data: deFiReacherAvailableRewards = [],
    isSuccess: isDeFiReacherSuccess,
    isLoading: isDeFiReacherLoading,
  } = useDeFiReacherRewards({ userAddress: address, merklRewards });

  const merklRewardsWithAmount = merklAvailableRewards.filter(
    (reward) => reward.amountToClaim > 0,
  );

  const deFiReacherRewardsWithAmount = deFiReacherAvailableRewards.filter(
    (reward) => reward.amountToClaim > 0,
  );

  const isLoading = isMerklLoading || isDeFiReacherLoading;
  const hasNoRewards =
    !merklRewardsWithAmount.length && !deFiReacherRewardsWithAmount.length;
  const isSuccess = isMerklSuccess || isDeFiReacherSuccess;

  if (hasNoRewards || !isSuccess) {
    return null;
  }

  return (
    <RewardsSectionContainer>
      <RewardsSectionContentContainer>
        <Typography variant="titleXSmall" sx={{ flexShrink: 0 }}>
          {t('profile_page.availableRewards')}
        </Typography>
        <RewardsCarousel>
          {isLoading &&
            Array.from({ length: 2 }).map((_, index) => (
              <RewardClaimCardSkeleton key={index} />
            ))}
          {!isLoading &&
            merklRewardsWithAmount.map((reward, i) => (
              <MerklRewardClaim
                key={`merkl-${i}-${reward.address}`}
                availableReward={reward}
              />
            ))}
          {!isLoading &&
            deFiReacherRewardsWithAmount.map((reward, i) => (
              <DefiReacherRewardClaim
                key={`defireacher-${i}-${reward.address}`}
                availableReward={reward}
              />
            ))}
        </RewardsCarousel>
      </RewardsSectionContentContainer>
    </RewardsSectionContainer>
  );
};
