'use client';
import { QuestPage as QuestsPageComponent } from 'src/components/Quests/QuestPage';
import { JUMPER_DISCOVER_PATH } from 'src/const/urls';
import { useAccounts } from 'src/hooks/useAccounts';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';

const MantlePage = () => {
  //HOOKS
  const { account } = useAccounts();
  const { quests, isQuestLoading } = useOngoingFestMissions('superfest'); // todo: add 'mantle' filter
  const {
    availableRewards,
    activeCampaigns,
    pastCampaigns,
    isLoading: isRewardLoading,
    isSuccess: isRewardSuccess,
  } = useMerklRewards({
    rewardChainId: 10,
    userAddress: account?.address,
  });
  return (
    <QuestsPageComponent
      title={'Hello Mantle'}
      url={'https://www.mantle.xyz/'}
      path={`${JUMPER_DISCOVER_PATH}mantle/`}
      quests={quests}
      availableRewards={availableRewards}
      activeCampaigns={activeCampaigns}
      pastCampaigns={pastCampaigns}
      isQuestLoading={isQuestLoading}
      isRewardLoading={isRewardLoading}
      isRewardSuccess={isRewardSuccess}
    />
  );
};

export default MantlePage;
