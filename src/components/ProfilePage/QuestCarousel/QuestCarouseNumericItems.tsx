import { useTranslation } from 'react-i18next';
import { useOngoingNumericQuests } from 'src/hooks/useOngoingNumericQuests';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';

type NumericAction = 'chain_oor' | 'transact_oor' | 'swap_oor' | 'bridge_oor';

export const QuestCarouselNumericItems = () => {
  const { t } = useTranslation();

  const {
    data: ongoingNumericQuests,
    isLoading: isongoingNumericQuestsLoading,
  } = useOngoingNumericQuests();

  const getNumericAction = (type: NumericAction) => {
    switch (type) {
      case 'chain_oor':
        return `${t('questCard.action.chain_oor')}`;
      case 'transact_oor':
        return `${t('questCard.action.transact_oor')}`;
      case 'swap_oor':
        return `${t('questCard.action.swap_oor')}`;
      default:
        return `${t('questCard.action.bridge_oor')}`;
    }
  };

  return !isongoingNumericQuestsLoading
    ? ongoingNumericQuests?.map((numericQuest, index) => (
        <QuestCardDetailled
          action={getNumericAction(numericQuest.type as NumericAction)}
          key={`available-mission-${index}`}
          title={numericQuest.displayName}
          hideProgressBar={
            numericQuest.nextRangeXP - numericQuest.currentRangeXP < 0
          }
          image={numericQuest.image}
          points={
            numericQuest.currentValue < numericQuest.min
              ? numericQuest.currentRangeXP
              : Math.abs(numericQuest.nextRangeXP - numericQuest.currentRangeXP)
          }
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
