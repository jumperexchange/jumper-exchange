import { CarouselContainer } from '@/components/Blog/BlogCarousel/CarouselContainer';
import type { Quest } from '@/types/loyaltyPass';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestsCarouselContainer } from './ActiveQuestsMissionsCarousel.style';

export function checkInclusion(
  activeCampaigns: string[],
  claimingIds: string[],
): boolean {
  const lowerActiveCampaigns = activeCampaigns.map((cId) => cId.toLowerCase());
  for (const id of claimingIds) {
    if (lowerActiveCampaigns.includes(id.toLowerCase())) {
      return true;
    }
  }
  return false;
}

interface QuestCarouselProps {
  quests?: Quest[];
  loading: boolean;
  activeCampaigns: string[];
  pastCampaigns?: string[];
  path: string;
}

export const ActiveQuestsMissionsCarousel = ({
  quests,
  loading,
  activeCampaigns,
  pastCampaigns,
  path,
}: QuestCarouselProps) => {
  const { url } = useOngoingFestMissions();

  const isNotLive =
    !loading && (!activeCampaigns || activeCampaigns.length === 0);
  return (
    <>
      {!isNotLive ? (
        <QuestsCarouselContainer>
          <CarouselContainer
            title={'Active Missions'}
            styles={{ paddingLeft: '32px' }}
          >
            {!loading ? (
              quests?.map((quest: Quest, index: number) => {
                const claimingIds =
                  quest.attributes?.CustomInformation?.['claimingIds'];
                const rewardsIds =
                  quest.attributes?.CustomInformation?.['rewardsIds'];
                const rewardType =
                  quest.attributes?.CustomInformation?.['rewardType'];
                const rewardRange =
                  quest.attributes?.CustomInformation?.['rewardRange'];
                let included = false;
                let completed = false;
                if (claimingIds && activeCampaigns) {
                  included = checkInclusion(activeCampaigns, claimingIds);
                }

                if (rewardsIds && pastCampaigns) {
                  completed = checkInclusion(pastCampaigns, rewardsIds);
                }

                const baseURL = quest.attributes.Image?.data?.attributes?.url;
                const imgURL = new URL(baseURL, url.origin);

                if (included) {
                  return (
                    <QuestCard
                      key={`active-superfest-mission-${index}`}
                      active={true}
                      path={path}
                      id={quest?.id}
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
                      chains={quest.attributes.CustomInformation?.['chains']}
                      completed={completed}
                      variableWeeklyAPY={
                        quest?.attributes.Points > 0 && rewardType === 'weekly'
                      }
                      rewardRange={rewardRange}
                    />
                  );
                }
              })
            ) : (
              <>
                {Array.from({ length: 3 }, () => 42).map((_, idx) => (
                  <QuestCardSkeleton key={'mission-card-skeleton-' + idx} />
                ))}
              </>
            )}
          </CarouselContainer>
        </QuestsCarouselContainer>
      ) : null}
    </>
  );
};
