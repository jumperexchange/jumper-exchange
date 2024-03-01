import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components';
import { BlogCarouselContainer } from './BlogCarousel.style';
import { QuestCard } from './QuestCard';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { Stack } from '@mui/material';
import { QuestCardSkeleton } from './QuestCardSkeleton';

interface BlogCarouselProps {
  showAllButton?: boolean;
  url?: URL;
  title?: string;
  //   data: BlogArticleData[];
}

const data = [
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
  {
    title: 'OP Red Wars',
    img: 'https://i.imgur.com/FUMliqO.png',
    points: 50,
  },
];

export const QuestCarousel = ({ quests }: any) => {
  const { t } = useTranslation();
  const { url } = useOngoingQuests();
  //   const { trackEvent } = useUserTracking();

  return (
    <BlogCarouselContainer>
      <CarouselContainer
        title={'Available Missions'}
        // trackingCategory={TrackingCategory.BlogCarousel}
      >
        <Stack direction={'row'} spacing={4}>
          {quests ? (
            quests?.map((quest: any, index: number) => {
              return (
                <QuestCard
                  key={`ongoing-mission-${index}`}
                  active={true}
                  title={quest?.attributes.Title}
                  image={
                    new URL(
                      quest.attributes.Image?.data?.attributes?.url,
                      url.origin,
                    )
                  }
                  points={quest?.attributes.Points}
                  link={quest?.attributes.Link}
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
