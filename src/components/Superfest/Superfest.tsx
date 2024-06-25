import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { Box, Stack } from '@mui/material';
import { SuperfestContainer } from './Superfest.style';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import { NFTClaimingBox } from './NFTClaimingBox/NFTClaimingBox';
import { HeroBox } from './HeroBox/HeroBox';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { QuestCarouselSuperfest } from './QuestCarousel/QuestCarousel';
import { SuperfestPresentedByBox } from './SuperfestPresentedBy/SuperfestPresentedByBox';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';

export const Superfest = () => {
  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { quests, isQuestLoading } = useOngoingFestMissions();

  return (
    <SuperfestContainer className="superfest">
      {/* <RewardsCarousel /> */}
      <HeroBox />
      <Box
        sx={{
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <QuestCarouselSuperfest quests={quests} loading={isQuestLoading} />
        <QuestCompletedList pdas={pdas} loading={isLoading} />
        <NFTClaimingBox />
      </Box>
    </SuperfestContainer>
  );
};
