'use client';

import { useTranslation } from 'react-i18next';
import {
  RewardsSectionContentContainer,
  RewardsSectionContainer,
  RewardsSectionHeaderContainer,
} from './Section.style';
import Typography from '@mui/material/Typography';
import { useContext, useMemo } from 'react';
import { useMerklRewards } from '@/hooks/rewards/useMerklRewards';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { RewardsCarousel } from '../components/RewardsCarousel/RewardsCarousel';
import { RewardClaimCardSkeleton } from '../components/RewardsCarousel/components/RewardClaimCardSkeleton';
import type { MerklRewardsData } from 'src/types/strapi';
import type { RewardItem } from '@/types/rewards';
import { MerklRewardClaim } from '../components/RewardsCarousel/components/MerklRewardClaim';
import { DefiReacherRewardClaim } from '../components/RewardsCarousel/components/DefiReacherRewardClaim';
import { useDeFiReacherRewards } from '@/hooks/rewards/useDeFiReacherRewards';
import { fromMerklRewardsData } from '@/utils/rewards/rewardFilterAdapters';
import { orderBy } from 'lodash';
import useMediaQuery from '@mui/material/useMediaQuery';
import { RewardsCarouselNavButtons } from '../components/RewardsCarousel/components/RewardsCarouselNavButtons';
import Box from '@mui/material/Box';
import { RewardsCarouselRoot } from '../components/RewardsCarousel/RewardsCarouselContext';

export const RewardsSection = ({
  merklRewards,
}: {
  merklRewards: MerklRewardsData[] | undefined;
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { walletAddress: address } = useContext(ProfileContext);

  const filterCriteria = useMemo(
    () => fromMerklRewardsData(merklRewards),
    [merklRewards],
  );

  const {
    availableRewards: merklAvailableRewards,
    isSuccess: isMerklSuccess,
    isLoading: isMerklLoading,
  } = useMerklRewards({
    userAddress: address,
    claimableOnly: true,
    filterCriteria,
  });

  const {
    data: deFiReacherAvailableRewards = [],
    isSuccess: isDeFiReacherSuccess,
    isLoading: isDeFiReacherLoading,
  } = useDeFiReacherRewards({ userAddress: address, filterCriteria });

  const rewards = useMemo((): RewardItem[] => {
    const _merkl: RewardItem[] = merklAvailableRewards.map((reward) => ({
      type: 'merkl',
      reward,
    }));

    const _defiReacher: RewardItem[] = deFiReacherAvailableRewards.map(
      (reward) => ({
        type: 'defi-reacher',
        reward,
      }),
    );

    const combined: RewardItem[] = [..._merkl, ..._defiReacher];
    return orderBy(combined, 'reward.amountToClaim', 'desc').filter(
      (r) => r.reward.amountToClaim > 0,
    );
  }, [merklAvailableRewards, deFiReacherAvailableRewards]);

  const isLoading = isMerklLoading || isDeFiReacherLoading;
  const hasNoRewards = !rewards.length;
  const isSuccess = isMerklSuccess || isDeFiReacherSuccess;

  if (hasNoRewards || !isSuccess) {
    return null;
  }

  return (
    <RewardsCarouselRoot>
      <RewardsSectionContainer>
        <RewardsSectionContentContainer>
          <RewardsSectionHeaderContainer>
            <Typography variant="titleXSmall" sx={{ flexShrink: 0 }}>
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
                  />
                ) : (
                  <DefiReacherRewardClaim
                    key={`defireacher-${i}-${r.reward.address}`}
                    availableReward={r.reward}
                  />
                ),
              )}
          </RewardsCarousel>
        </RewardsSectionContentContainer>
      </RewardsSectionContainer>
    </RewardsCarouselRoot>
  );
};
