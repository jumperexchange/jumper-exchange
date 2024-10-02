import { useOngoingNumericQuests } from 'src/hooks/useOngoingNumericQuests';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';

export const QuestCarouselNumericItems = () => {
  const {
    data: ongoingNumericQuests,
    isLoading: isongoingNumericQuestsLoading,
  } = useOngoingNumericQuests();
  return !isongoingNumericQuestsLoading
    ? ongoingNumericQuests?.map((numericQuest, index) => (
        <QuestCardDetailled
          key={`available-mission-${index}`}
          active={true}
          title={numericQuest.displayName}
          image={numericQuest.image}
          points={numericQuest.points}
          rewardsProgress={{
            min: numericQuest.min,
            max: numericQuest.max,
            points: numericQuest.points,
          }}
        />
      ))
    : Array.from({ length: 4 }, (_, idx) => (
        <QuestCardSkeleton key={`ongoing-numeric-quests-skeleton-${idx}`} />
      ));
};
