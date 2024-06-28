import { useAccounts } from '@/hooks/useAccounts';
import type { Quest } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { CompletedQuestContainer } from './AvailableMissionsList.style';

interface QuestCompletedListProps {
  quests?: Quest[];
  loading: boolean;
}

export const AvailableMissionsList = ({
  quests,
  loading,
}: QuestCompletedListProps) => {
  const { account } = useAccounts();
  const { t } = useTranslation();
  const { url } = useOngoingFestMissions();

  return (
    <CompletedQuestContainer>
      <CarouselContainer title={'Available Missionssss'}>
        {!loading && quests
          ? quests?.map((quest: Quest, index: number) => {
              return (
                <QuestCard
                  key={`available-mission-${index}`}
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
            })
          : null}
        {loading
          ? Array.from({ length: 12 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))
          : null}
      </CarouselContainer>
    </CompletedQuestContainer>
  );
};
