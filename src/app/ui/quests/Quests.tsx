'use client';

import { Quests as QuestsComponent } from 'src/components/Quests';
import { useAccounts } from 'src/hooks/useAccounts';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';

const Quests = () => {
  //HOOKS
  const { account } = useAccounts();
  const { quests, isQuestLoading } = useOngoingFestMissions();
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
    <QuestsComponent
      title={'Hello Mantle'}
      url={'https://www.mantle.xyz/'}
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

export default Quests;
