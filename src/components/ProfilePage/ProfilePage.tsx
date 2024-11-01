'use client';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { Box, Grid, Stack } from '@mui/material';
import { useContext } from 'react';
import { useMerklRewardsOnCampaigns } from '@/hooks/useMerklRewardsOnCampaigns';
import { AddressBox } from '@/components/ProfilePage/AddressBox/AddressBox';
import { Leaderboard } from '@/components/ProfilePage/Leaderboard/Leaderboard';
import { TierBox } from '@/components/ProfilePage/LevelBox/TierBox';
import {
  ProfilePageContainer,
  ProfilePageHeaderBox,
} from './ProfilePage.style';
import { QuestCarousel } from './QuestCarousel/QuestCarousel';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { useTraits } from 'src/hooks/useTraits';

import { MerkleRewards } from '@/components/ProfilePage/MerkleRewards';
import { ProfileContext } from '@/providers/ProfileProvider';

export const ProfilePage = () => {
  const { walletAddress, isPublic, isEVMAddress } = useContext(ProfileContext);

  const { isLoading, points, tier, pdas } = useLoyaltyPass(walletAddress);
  const { traits } = useTraits();
  const { pastCampaigns } = useMerklRewardsOnCampaigns({
    userAddress: walletAddress,
  });

  return (
    <>
      <ProfilePageContainer className="profile-page">
        {!isPublic && <MerkleRewards />}
        <Grid container>
          <Grid
            xs={12}
            md={4}
            sx={{
              paddingRight: { xs: 0, md: 4 },
              paddingBottom: { xs: 4, md: 0 },
            }}
          >
            <AddressBox address={walletAddress} isEVM={isEVMAddress} />
            <Box display={{ xs: 'none', md: 'block' }}>
              <Leaderboard address={walletAddress} />
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
