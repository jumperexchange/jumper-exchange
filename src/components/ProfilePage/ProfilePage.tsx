import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { Box, Grid, Stack } from '@mui/material';
import {
  REWARD_TOKEN_ADDRESS,
  REWARD_TOKEN_CHAINID,
} from 'src/const/partnerRewardsTheme';
import { useMercleNft } from 'src/hooks/useMercleNft';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
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

export const ProfilePage = () => {
  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { imageLink } = useMercleNft({ userAddress: account?.address });
  const { quests, isQuestLoading } = useOngoingQuests();

  const {
    availableRewards,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewards({
    rewardChainId: REWARD_TOKEN_CHAINID,
    userAddress: account?.address,
    rewardToken: REWARD_TOKEN_ADDRESS,
  });

  return (
    <>
      <RewardsCarousel
        // hideComponent={false}
        hideComponent={!account?.address || isRewardLoading || !isRewardSuccess}
        rewardAmount={availableRewards?.[0]?.amountToClaim as number}
        accumulatedAmountForContractBN={
          availableRewards?.[0]?.accumulatedAmountForContractBN
        }
        proof={availableRewards?.[0]?.proof}
        isMerklSuccess={isRewardSuccess}
      />
      <ProfilePageContainer className="profile-page">
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
              imageLink={imageLink}
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

              <QuestCarousel
                quests={quests}
                loading={isQuestLoading}
                pastCampaigns={pastCampaigns}
              />
              <QuestCompletedList pdas={pdas} loading={isLoading} />
            </Stack>
          </Grid>
        </Grid>
      </ProfilePageContainer>
    </>
  );
};
