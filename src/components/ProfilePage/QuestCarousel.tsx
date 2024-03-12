import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components';
import { QuestCard } from './QuestCard';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { Stack } from '@mui/material';
import { QuestCardSkeleton } from './QuestCardSkeleton';
import { BlogCarouselContainer } from '../Blog/BlogCarousel/BlogCarousel.style';
import { Quest } from 'src/types';

interface QuestCarouselProps {
  quests?: Quest[];
}

export const QuestCarousel = ({ quests }: QuestCarouselProps) => {
  const { url } = useOngoingQuests();

  return (
    <BlogCarouselContainer>
      <CarouselContainer title={'Available Missions'}>
        <Stack direction={'row'} spacing={4}>
          {quests ? (
            quests?.map((quest: Quest, index: number) => {
              return (
                <QuestCard
                  key={`ongoing-mission-${index}`}
                  active={true}
                  title={quest?.attributes.Title}
                  image={String(
                    new URL(
                      quest.attributes.Image?.data?.attributes?.url,
                      url.origin,
                    ),
                  )}
                  points={quest?.attributes.Points}
                  link={quest?.attributes.Link}
                  startDate={quest?.attributes.StartDate}
                  endDate={quest?.attributes.EndDate}
                  platformName={
                    quest?.attributes.quests_platform?.data?.attributes?.Name
                  }
                  platformImage={String(
                    new URL(
                      quest.attributes.quests_platform?.data?.attributes?.Logo?.data?.attributes?.url,
                      url.origin,
                    ),
                  )}
                />
              );
            })
          ) : (
            <>
              {Array.from({ length: 3 }, () => 42).map((el) => (
                <QuestCardSkeleton />
              ))}
            </>
          )}
        </Stack>
      </CarouselContainer>
    </BlogCarouselContainer>
  );
};
