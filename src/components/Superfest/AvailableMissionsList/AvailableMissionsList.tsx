import type { Quest } from '@/types/loyaltyPass';
import { CarouselContainer } from 'src/components/Blog';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { AvailableMissionsContainer } from './AvailableMissionsList.style';

interface QuestCompletedListProps {
  quests?: Quest[];
  loading: boolean;
}

export const AvailableMissionsList = ({
  quests,
  loading,
}: QuestCompletedListProps) => {
  const { url } = useOngoingFestMissions();

  return (
    <AvailableMissionsContainer>
      <CarouselContainer title="Available Missions">
        {quests && !loading && quests
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
          : Array.from({ length: 12 }, () => 42).map((_, idx) => (
              <QuestCardSkeleton key={'skeleton-' + idx} />
            ))}
      </CarouselContainer>
    </AvailableMissionsContainer>
  );
};
