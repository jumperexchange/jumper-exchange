import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { useAccount } from '@lifi/wallet-management';
import { Box, Grid, Stack } from '@mui/material';
import { useMemo } from 'react';
import type { AvailableRewards } from 'src/hooks/useMerklRewardsOnCampaigns';
import { useMerklRewardsOnCampaigns } from 'src/hooks/useMerklRewardsOnCampaigns';
import { AddressBox } from './AddressBox/AddressBox';
import { Leaderboard } from './Leaderboard/Leaderboard';
import { TierBox } from './LevelBox/TierBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
} from './ProfilePage.style';
import { QuestCarousel } from './QuestCarousel/QuestCarousel';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import { useTraits } from 'src/hooks/useTraits';
// import { useABTest } from 'src/hooks/useABTest';

const shouldHideComponent = (
  account: { address?: string } | undefined,
  isRewardLoading: boolean,
  isRewardSuccess: boolean,
  availableRewards: AvailableRewards[],
) => {
  return (
    !account?.address ||
    isRewardLoading ||
    !isRewardSuccess ||
    availableRewards?.filter((e) => e?.amountToClaim > 0)?.length === 0
  );
};

export const ProfilePage = () => {
  const { account } = useAccount();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { isLoading: isTraitLoading, traits } = useTraits();
  // const { isEnabled: isABTestEnabled } = useABTest({
  //   feature: 'test_ab_1',
  //   user: account?.address || '',
  // });
  const {
    availableRewards,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewardsOnCampaigns({
    userAddress: account?.address,
  });

  const hideComponent = useMemo(
    () =>
      shouldHideComponent(
        account,
        isRewardLoading,
        isRewardSuccess,
        availableRewards,
      ),
    [account, isRewardLoading, isRewardSuccess, availableRewards],
  );

  return (
    <>
      <ProfilePageContainer className="profile-page">
        <RewardsCarousel
          hideComponent={hideComponent}
          availableRewards={availableRewards}
          isMerklSuccess={isRewardSuccess}
        />
        <Grid container>
          <Grid
            xs={12}
            md={4}
            sx={{
              paddingRight: { xs: 0, md: 4 },
              paddingBottom: { xs: 4, md: 0 },
            }}
          >
            <AddressBox
              address={account?.address}
              isEVM={account?.chainType === 'EVM'}
            />
            <Box display={{ xs: 'none', md: 'block' }}>
              <Leaderboard address={account?.address} />
            </Box>
          </Grid>
          <Grid xs={12} md={8}>
            <Stack spacing={{ xs: 2, sm: 4 }}>
              <ProfilePageHeaderBox
                sx={{ display: 'flex', flex: 2, paddingX: { xs: 0, sm: 1 } }}
              >
                <TierBox points={points} tier={tier} loading={isLoading} />
              </ProfilePageHeaderBox>

              <QuestCarousel pastCampaigns={pastCampaigns} traits={traits} />
              <QuestCompletedList pdas={pdas} loading={isLoading} />
            </Stack>
          </Grid>
        </Grid>
      </ProfilePageContainer>
    </>
  );
};
