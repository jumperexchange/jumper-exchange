import { useTranslation } from 'react-i18next';
import { useOngoingNumericQuests } from 'src/hooks/useOngoingNumericQuests';
import { getMonthInfo } from 'src/utils/getRemainingDaysOfMonth';
import { QuestCard } from '../QuestCard/QuestCard';

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

  const monthInfo = getMonthInfo();

  return !isongoingNumericQuestsLoading
    ? ongoingNumericQuests?.map((numericQuest, index) => (
        <QuestCard
          action={getNumericAction(numericQuest.type as NumericAction)}
          key={`available-mission-${index}`}
          title={numericQuest.displayName}
          hideXPProgressComponents={
            numericQuest.nextRangeXP - numericQuest.currentRangeXP < 0
          }
          image={numericQuest.image}
          points={
            numericQuest.currentValue < numericQuest.min
              ? numericQuest.currentRangeXP
              : Math.abs(numericQuest.nextRangeXP - numericQuest.currentRangeXP)
          }
          rewardsProgress={{
            min: 1,
            max: monthInfo.maxDays,
            currentValue: monthInfo.today,
            earnedXP:
              numericQuest.currentValue >= numericQuest.min
                ? numericQuest.currentRangeXP
                : undefined,
          }}
        />
      ))
    : Array.from({ length: 4 }, (_, idx) => (
        <QuestCard key={`ongoing-numeric-quests-skeleton-${idx}`} />
      ));
};
