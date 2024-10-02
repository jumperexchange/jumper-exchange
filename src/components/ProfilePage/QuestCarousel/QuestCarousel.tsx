import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { useOngoingNumericQuests } from 'src/hooks/useOngoingNumericQuests';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';
import { QuestCarouselContainer } from './QuestCarousel.style';
import { QuestCarouselItems } from './QuestCarouselItems';

interface QuestCarouselProps {
  pastCampaigns?: string[];
}

export const QuestCarousel = ({ pastCampaigns }: QuestCarouselProps) => {
  const { t } = useTranslation();
  return (
    <QuestCarouselContainer>
      <CarouselContainer title={t('missions.available')}>
        {/** render quests */}
        <QuestCarouselItems pastCampaigns={pastCampaigns} />
        {/** render ongoing numeric quests */}
        <QuestCarouselNumericItems />
      </CarouselContainer>
    </QuestCarouselContainer>
  );
};

const QuestCarouselNumericItems = () => {
  const {
    data: ongoingNumericQuests,
    isLoading: isongoingNumericQuestsLoading,
  } = useOngoingNumericQuests();
  return !isongoingNumericQuestsLoading
    ? ongoingNumericQuests.map((numericQuest, index) => (
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
        <QuestCardSkeleton key={`quest-card-item-skeleton-${idx}`} />
      ));
};
