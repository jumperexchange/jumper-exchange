'use client';

import { useTranslation } from 'react-i18next';
import {
  RewardsSectionContentContainer,
  IntroSectionContainer,
} from './Section.style';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { useMerklRewards } from 'src/hooks/useMerklRewards';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { RewardsCarousel } from '../components/RewardsCarousel/RewardsCarousel';
import { RewardClaimCard } from '../components/RewardsCarousel/RewardClaimCard';
import { RewardClaimCardSkeleton } from '../components/RewardsCarousel/RewardClaimCardSkeleton';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';

export const RewardsSection = () => {
  const { t } = useTranslation();
  // const { walletAddress: address } = useContext(ProfileContext);
  const address = '0xb29601eB52a052042FB6c68C69a442BD0AE90082';

  const { availableRewards, isSuccess, isLoading } = useMerklRewards({
    userAddress: address,
    includeTokenIcons: true,
    claimableOnly: true,
  });

  const rewardsWithAmount = availableRewards.filter(
    (reward) => reward.amountToClaim > 0 && isSuccess,
  );

  if (!rewardsWithAmount.length) {
    return null;
  }

  return (
    <SectionCard>
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
    </SectionCard>
  );
};
