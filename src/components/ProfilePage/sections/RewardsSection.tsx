'use client';

import { useTranslation } from 'react-i18next';
import {
  RewardsSectionContentContainer,
  RewardsSectionContainer,
  RewardsSectionHeaderContainer,
} from './Section.style';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { RewardsCarousel } from '../components/RewardsCarousel/RewardsCarousel';
import { RewardClaimCardSkeleton } from '../components/RewardsCarousel/components/RewardClaimCardSkeleton';
import { MerklRewardClaim } from '../components/RewardsCarousel/components/MerklRewardClaim';
import { DefiReacherRewardClaim } from '../components/RewardsCarousel/components/DefiReacherRewardClaim';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RewardsCarouselNavButtons } from '../components/RewardsCarousel/components/RewardsCarouselNavButtons';
import Box from '@mui/material/Box';
import { RewardsCarouselRoot } from '../components/RewardsCarousel/RewardsCarouselContext';
import { useAvailableRewards } from '@/hooks/rewards/useAvailableRewards';

interface RewardsSectionProps {
  jumperCampaignId?: string;
}

export const RewardsSection = ({
  jumperCampaignId,
}: RewardsSectionProps = {}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { walletAddress: address } = useContext(ProfileContext);

  const { rewards, isLoading, isSuccess } = useAvailableRewards({
    userAddress: address,
    jumperCampaignId,
  });

  if (!rewards.length || !isSuccess) {
    return null;
  }

  return (
    <RewardsCarouselRoot>
      <RewardsSectionContainer>
        <RewardsSectionContentContainer>
          <RewardsSectionHeaderContainer>
            <Typography
              variant="titleXSmall"
              sx={{ color: 'accent1.main', flexShrink: 0 }}
            >
              {t('profile_page.availableRewards')}
            </Typography>
            {isMobile && (
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <RewardsCarouselNavButtons />
              </Box>
            )}
          </RewardsSectionHeaderContainer>
          <RewardsCarousel>
            {isLoading &&
              Array.from({ length: 2 }).map((_, index) => (
                <RewardClaimCardSkeleton key={index} />
              ))}
            {!isLoading &&
              rewards.map((r, i) =>
                r.type === 'merkl' ? (
                  <MerklRewardClaim
                    key={`merkl-${i}-${r.reward.address}`}
                    availableReward={r.reward}
                    balance={r.balance}
                  />
                ) : (
                  <DefiReacherRewardClaim
                    key={`defireacher-${i}-${r.reward.address}`}
                    availableReward={r.reward}
                    balance={r.balance}
                  />
                ),
              )}
          </RewardsCarousel>
        </RewardsSectionContentContainer>
      </RewardsSectionContainer>
    </RewardsCarouselRoot>
  );
};
