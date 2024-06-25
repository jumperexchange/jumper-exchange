import { CarouselContainer } from '@/components/Blog/BlogCarousel/CarouselContainer';
import type { Quest } from '@/types/loyaltyPass';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { SuperfestCarouselContainer } from './QuestCarousel.style';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';

interface QuestCarouselProps {
  quests?: Quest[];
  loading: boolean;
}

export const QuestCarouselSuperfest = ({
  quests,
  loading,
}: QuestCarouselProps) => {
  const { url } = useOngoingFestMissions();
  const { t } = useTranslation();

  const isNotLive = !loading && (!quests || quests.length === 0);

  return (
    <>
      {!isNotLive ? (
        <SuperfestCarouselContainer>
          <CarouselContainer
            title={t('missions.available')}
            itemsCount={quests?.length}
            styles={{ paddingLeft: '32px' }}
          >
            <Stack direction={'row'} spacing={{ xs: 2, sm: 4 }}>
              {!loading ? (
                quests?.map((quest: Quest, index: number) => {
                  return (
                    <QuestCard
                      key={`ongoing-mission-${index}`}
                      active={true}
                      title={quest?.attributes.Title}
                      image={`
                    ${new URL(
                      quest.attributes.Image?.data?.attributes?.url,
                      url.origin,
                    )}`}
                      points={quest?.attributes.Points}
                      link={quest?.attributes.Link}
                      startDate={quest?.attributes.StartDate}
                      endDate={quest?.attributes.EndDate}
                      platformName={
                        quest?.attributes.quests_platform?.data?.attributes
                          ?.Name
                      }
                      platformImage={`
                    ${new URL(
                      quest.attributes.quests_platform?.data?.attributes?.Logo?.data?.attributes?.url,
                      url.origin,
                    )}
                  `}
                      slug={quest?.attributes.Slug}
                    />
                  );
                })
              ) : (
                <>
                  {Array.from({ length: 3 }, () => 42).map((_, idx) => (
                    <QuestCardSkeleton key={'mission-card-skeleton-' + idx} />
                  ))}
                </>
              )}
            </Stack>
          </CarouselContainer>
        </SuperfestCarouselContainer>
      ) : null}
    </>
  );
};
