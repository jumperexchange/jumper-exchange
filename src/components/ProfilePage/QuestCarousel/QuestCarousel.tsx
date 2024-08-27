import { CarouselContainer } from '@/components/Blog/BlogCarousel/CarouselContainer';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import type { Quest } from '@/types/loyaltyPass';
import { useTranslation } from 'react-i18next';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCarouselContainer } from './QuestCarousel.style';
import { TempTitle } from './TempTitle/TempTitle';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';

interface QuestCarouselProps {
  quests?: Quest[];
  loading: boolean;
}

export const QuestCarousel = ({ quests, loading }: QuestCarouselProps) => {
  const { url } = useOngoingQuests();
  const { t } = useTranslation();

  const isNotLive = !loading && (!quests || quests.length === 0);

  return (
    <>
      {!isNotLive ? (
        <QuestCarouselContainer>
          <TempTitle />
          <CarouselContainer title={t('missions.available')}>
            {!loading
              ? quests?.map((quest: Quest, index: number) => {
                  const baseURL = quest.attributes.Image?.data?.attributes?.url;
                  const imgURL = new URL(baseURL, url.origin);
                  const rewards =
                    quest.attributes.CustomInformation?.['rewards'];
                  const rewardType =
                    quest.attributes?.CustomInformation?.['rewardType'];
                  const rewardRange =
                    quest.attributes?.CustomInformation?.['rewardRange'];
                  const chains = quest.attributes.CustomInformation?.['chains'];
                  const claimingIds =
                    quest.attributes?.CustomInformation?.['claimingIds'];
                  const rewardsIds =
                    quest.attributes?.CustomInformation?.['rewardsIds'];

                  //todo: exclude in a dedicated helper function

                  let completed = false;
                  // if (rewardsIds && pastCampaigns) {
                  //   completed = checkInclusion(pastCampaigns, rewardsIds);
                  // }

                  return (
                    // <QuestCard
                    //   key={`ongoing-mission-${index}`}
                    //   active={true}
                    //   title={quest?.attributes.Title}
                    //   image={
                    //     quest.attributes.Image?.data?.attributes?.url &&
                    //     new URL(
                    //       quest.attributes.Image?.data?.attributes?.url,
                    //       url.origin,
                    //     ).toString()
                    //   }
                    //   points={quest?.attributes.Points}
                    //   link={quest?.attributes.Link}
                    //   startDate={quest?.attributes.StartDate}
                    //   endDate={quest?.attributes.EndDate}
                    //   platformName={
                    //     quest?.attributes.quests_platform?.data?.attributes
                    //       ?.Name
                    //   }
                    //   platformImage={new URL(
                    //     quest.attributes.quests_platform?.data?.attributes?.Logo?.data?.attributes?.url,
                    //     url.origin,
                    //   ).toString()}
                    // />
                    <QuestCardDetailled
                      key={`available-mission-${index}`}
                      active={true}
                      title={quest?.attributes.Title}
                      image={String(imgURL)}
                      points={quest?.attributes.Points}
                      link={quest?.attributes.Link}
                      startDate={quest?.attributes.StartDate}
                      endDate={quest?.attributes.EndDate}
                      platformName={
                        quest?.attributes.quests_platform?.data?.attributes
                          ?.Name
                      }
                      slug={quest?.attributes.Slug}
                      chains={chains}
                      rewards={rewards}
                      completed={completed}
                      claimingIds={claimingIds}
                      variableWeeklyAPY={
                        quest?.attributes.Points > 0 && rewardType === 'weekly'
                      }
                      rewardRange={rewardRange}
                    />
                  );
                })
              : Array.from({ length: 3 }, () => 42).map((_, idx) => (
                  <QuestCardSkeleton key={'mission-card-skeleton-' + idx} />
                ))}
          </CarouselContainer>
        </QuestCarouselContainer>
      ) : null}
    </>
  );
};
