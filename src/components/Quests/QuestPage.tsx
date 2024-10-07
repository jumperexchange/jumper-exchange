import type { Account } from '@/hooks/useAccounts';
import type { AvailableRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import type { Quest } from 'src/types/loyaltyPass';
import { MantleLogo } from '../illustrations/MantleLogo';
import { RewardsCarousel } from '../Superfest/Rewards/RewardsCarousel';
import { ActiveQuestsMissionsCarousel } from './ActiveQuestsMissionsCarousel/ActiveQuestsMissionsCarousel';
import { AvailableMissionsList } from './AvailableMissionsList/AvailableMissionsList';
import { HeroBox } from './HeroBox/HeroBox';
import { QuestPageMainBox, QuestsContainer } from './QuestPage.style';

interface QuestsProps {
  title: string;
  url: string;
  account?: Account;
  quests?: Quest[];
  path: string;
  isQuestLoading: boolean;
  availableRewards: AvailableRewards[];
  activeCampaigns: string[];
  pastCampaigns: string[];
  isRewardLoading: boolean;
  isRewardSuccess: boolean;
}

export const QuestPage = ({
  title,
  url,
  account,
  quests,
  path,
  isQuestLoading,
  availableRewards,
  activeCampaigns,
  pastCampaigns,
  isRewardLoading,
  isRewardSuccess,
}: QuestsProps) => {
  return (
    <QuestsContainer>
      <RewardsCarousel
        hideComponent={!account?.address || isRewardLoading || !isRewardSuccess}
        rewardAmount={availableRewards?.[0]?.amountToClaim as number}
        accumulatedAmountForContractBN={
          availableRewards?.[0]?.accumulatedAmountForContractBN
        }
        proof={availableRewards?.[0]?.proof}
        isMerklSuccess={isRewardSuccess}
      />
      <HeroBox
        title={title}
        url={url}
        logoMobile={<MantleLogo />}
        logoDesktop={<MantleLogo />}
      />
      <QuestPageMainBox>
        {!account?.address ||
        isQuestLoading ||
        !activeCampaigns ||
        activeCampaigns.length === 0 ? undefined : (
          <ActiveQuestsMissionsCarousel
            path={path}
            quests={quests}
            loading={isQuestLoading}
            activeCampaigns={activeCampaigns}
            pastCampaigns={pastCampaigns}
          />
        )}
        <AvailableMissionsList
          path={path}
          quests={quests}
          loading={isQuestLoading}
          pastCampaigns={pastCampaigns}
        />
      </QuestPageMainBox>
    </QuestsContainer>
  );
};
