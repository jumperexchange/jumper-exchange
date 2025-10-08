'use client';

import { useTranslation } from 'react-i18next';
import {
  RewardsSectionContentContainer,
  RewardsSectionContainer,
} from './Section.style';
import Typography from '@mui/material/Typography';
import { useContext, useMemo } from 'react';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { RewardsCarousel } from '../components/RewardsCarousel/RewardsCarousel';
import { RewardClaimCard } from '../components/RewardsCarousel/RewardClaimCard';
import { RewardClaimCardSkeleton } from '../components/RewardsCarousel/RewardClaimCardSkeleton';
import { MerklRewardsData } from 'src/types/strapi';
import { useChains } from 'src/hooks/useChains';

export const RewardsSection = ({
  merklRewards,
}: {
  merklRewards: MerklRewardsData[] | undefined;
}) => {
  const { t } = useTranslation();
  const { walletAddress: address } = useContext(ProfileContext);

  const { availableRewards, isSuccess, isLoading } = useMerklRewards({
    userAddress: address,
    includeTokenIcons: true,
    claimableOnly: true,
    merklRewards,
  });

  const rewardsWithAmount = availableRewards.filter(
    (reward) => reward.amountToClaim > 0,
  );

  if (!rewardsWithAmount.length || !isSuccess) {
    return null;
  }

  return (
    <RewardsSectionContainer>
      <RewardsSectionContentContainer>
        <Typography variant="titleXSmall" sx={{ flexShrink: 0 }}>
          {t('profile_page.availableRewards')}
        </Typography>
        <RewardsCarousel>
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <RewardClaimCardSkeleton key={index} />
              ))
            : rewardsWithAmount.map((reward, i) => (
                <RewardClaimCard
                  key={`${i}-${reward.address}`}
                  availableReward={reward}
                />
              ))}
        </RewardsCarousel>
      </RewardsSectionContentContainer>
    </RewardsSectionContainer>
  );
};
