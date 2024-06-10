import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { Stack } from '@mui/material';

import { SuperfestContainer } from './Superfest.style';
import { QuestCarousel } from '../ProfilePage/QuestCarousel/QuestCarousel';
import { QuestCompletedList } from '../ProfilePage/QuestsCompleted/QuestsCompletedList';
import { RewardsCarousel } from '../Rewards/RewardsCarousel';

export const Superfest = () => {
  const { account } = useAccounts();
  const { isLoading, points, tier, pdas } = useLoyaltyPass();
  const { quests, isQuestLoading } = useOngoingQuests();

  return (
    <SuperfestContainer className="superfest">
      <Stack direction={'column'} spacing={{ xs: 2, sm: 4 }}>
        <RewardsCarousel />
        <QuestCarousel quests={quests} loading={isQuestLoading} />
        <QuestCompletedList pdas={pdas} loading={isLoading} />
      </Stack>
    </SuperfestContainer>
  );
};
