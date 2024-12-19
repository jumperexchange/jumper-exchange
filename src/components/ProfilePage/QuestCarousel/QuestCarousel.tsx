import { useTranslation } from 'react-i18next';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import type { Quest } from 'src/types/loyaltyPass';
import { checkInclusion } from '../checkInclusion';
import { QuestCard } from '../QuestCard/QuestCard';
import { Box } from '@mui/material';

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
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();

  return <Box>Quest Carousel</Box>;
};
