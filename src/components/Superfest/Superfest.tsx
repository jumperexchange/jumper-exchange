import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { Stack } from '@mui/material';
import { SuperfestContainer } from './Superfest.style';
import { RewardsCarousel } from './Rewards/RewardsCarousel';
import { NFTClaimingBox } from './NFTClaimingBox/NFTClaimingBox';
import { HeroBox } from './HeroBox/HeroBox';
import { QuestCompletedList } from './QuestsCompleted/QuestsCompletedList';
import { QuestCarouselSuperfest } from './QuestCarousel/QuestCarousel';

export const Superfest = () => {
  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { quests, isQuestLoading } = useOngoingQuests();

  return (
    <SuperfestContainer className="superfest">
      <Stack direction={'column'} spacing={{ xs: 2, sm: 4 }}>
        <HeroBox />
        <RewardsCarousel />
        <QuestCarouselSuperfest quests={quests} loading={isQuestLoading} />
        <NFTClaimingBox />
        <QuestCompletedList pdas={pdas} loading={isLoading} />
      </Stack>
    </SuperfestContainer>
  );
};
