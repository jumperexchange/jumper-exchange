import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { QuestCarouselContainer } from './QuestCarousel.style';
import { QuestCarouselItems } from './QuestCarouselItems';
import { Trait } from 'src/types/loyaltyPass';
import { QuestCarouselNumericItems } from './QuestCarouseNumericItems';

interface QuestCarouselProps {
  pastCampaigns?: string[];
  traits?: string[];
  // traits?: Trait[];
}

export const QuestCarousel = ({
  pastCampaigns,
  traits,
}: QuestCarouselProps) => {
  const { t } = useTranslation();
  return (
    <QuestCarouselContainer>
      <CarouselContainer title={t('missions.available')}>
        {/** render quests */}
        <QuestCarouselItems pastCampaigns={pastCampaigns} traits={traits} />
        {/** render ongoing numeric quests */}
        <QuestCarouselNumericItems />
      </CarouselContainer>
    </QuestCarouselContainer>
  );
};
