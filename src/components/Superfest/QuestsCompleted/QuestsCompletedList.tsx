import { useAccounts } from '@/hooks/useAccounts';
import type { Quest } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import {
  CompletedQuestContainer,
  CompletedQuestHeader,
  CompletedQuestStack,
  CompletedQuestTitle,
} from './QuestsCompletedList.style';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';

function checkInclusion(
  activeCampaigns: string[],
  claimingIds: string[],
): boolean {
  const lowerActiveCampaigns = activeCampaigns.map((cId) => cId.toLowerCase());
  for (const id of claimingIds) {
    if (lowerActiveCampaigns.includes(id.toLowerCase())) {
      return true;
    }
  }
  return false;
}

interface QuestCompletedListProps {
  activeCampaigns: string[];
  quests?: Quest[];
  loading: boolean;
}

export const QuestCompletedList = ({
  activeCampaigns,
  quests,
  loading,
}: QuestCompletedListProps) => {
  const { account } = useAccounts();
  const { t } = useTranslation();
  const { url } = useOngoingFestMissions();

  return (
    <CompletedQuestContainer>
      <CompletedQuestHeader>
        <CompletedQuestTitle>{'Active Missions'}</CompletedQuestTitle>
      </CompletedQuestHeader>
      <CompletedQuestStack
        direction={'row'}
        spacing={{ xs: 2, sm: 4 }}
        useFlexGap
        flexWrap="wrap"
      >
        {!loading && quests
          ? quests?.map((quest: Quest, index: number) => {
              const claimingIds =
                quest.attributes?.CustomInformation?.['claimingIds'];
              let included = false;
              if (claimingIds && activeCampaigns) {
                included = checkInclusion(activeCampaigns, claimingIds);
              }

              if (included) {
                return (
                  <QuestCard
                    key={`active-mission-${index}`}
                    active={true}
                    title={quest?.attributes.Title}
                    image={`
                    ${new URL(
                      quest.attributes.Image?.data?.attributes?.url,
                      url.origin,
                    )}`}
                    points={quest?.attributes.Points}
                    link={quest?.attributes.Link}
                    startDate={quest?.attributes.StartDate}
                    endDate={quest?.attributes.EndDate}
                    platformName={
                      quest?.attributes.quests_platform?.data?.attributes?.Name
                    }
                    platformImage={`
                    ${new URL(
                      quest.attributes.quests_platform?.data?.attributes?.Logo?.data?.attributes?.url,
                      url.origin,
                    )}
                  `}
                    slug={quest?.attributes.Slug}
                    chains={quest.attributes.CustomInformation?.['chains']}
                  />
                );
              }
            })
          : null}
        {loading
          ? Array.from({ length: 4 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CompletedQuestStack>
    </CompletedQuestContainer>
  );
};
