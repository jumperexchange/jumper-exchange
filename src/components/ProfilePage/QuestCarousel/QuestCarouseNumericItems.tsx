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
          title={numericQuest.displayName}
          image={numericQuest.image}
          points={numericQuest.nextRangeXP - numericQuest.currentRangeXP}
          rewardsProgress={{
            min: numericQuest.min,
            max: numericQuest.max,
            currentValue: numericQuest.currentValue,
            earnedXP:
              numericQuest.currentValue >= numericQuest.min
                ? numericQuest.currentRangeXP
                : undefined,
          }}
        />
      ))
    : Array.from({ length: 4 }, (_, idx) => (
        <QuestCardSkeleton
          key={`ongoing-numeric-quests-skeleton-${idx}`}
          sx={{
            width: 288,
            height: 436,
            borderRadius: '8px',
          }}
        />
      ));
};
