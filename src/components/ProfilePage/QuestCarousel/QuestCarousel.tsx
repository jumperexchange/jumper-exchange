import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { QuestCarouselContainer } from './QuestCarousel.style';
import { QuestCarouselItems } from './QuestCarouselItems';
import { QuestCarouselNumericItems } from './QuestCarouseNumericItems';

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
        {/* <QuestCarouselNumericItems /> */}
      </CarouselContainer>
    </QuestCarouselContainer>
  );
};
