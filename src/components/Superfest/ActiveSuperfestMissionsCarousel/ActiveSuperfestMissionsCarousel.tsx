import { CarouselContainer } from '@/components/Blog/BlogCarousel/CarouselContainer';
import type { Quest } from '@/types/loyaltyPass';
import { useOngoingFestMissions } from 'src/hooks/useOngoingFestMissions';
import { QuestCard } from '../QuestCard/QuestCard';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { SuperfestCarouselContainer } from './ActiveSuperfestMissionsCarousel.style';
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
}

export const ActiveSuperfestMissionsCarousel = ({
  quests,
  loading,
  activeCampaigns,
  pastCampaigns,
}: QuestCarouselProps) => {
  const { url } = useOngoingFestMissions();

  const isNotLive =
    !loading && (!activeCampaigns || activeCampaigns.length === 0);
  return (
    <>
      {!isNotLive ? (
        <SuperfestCarouselContainer>
          <CarouselContainer
            title={'Active Missions'}
            sx={{ paddingLeft: '32px' }}
          >
            {!loading ? (
              quests?.map((quest, index: number) => {
                const claimingIds = quest?.CustomInformation?.['claimingIds'];
                const rewardsIds = quest?.CustomInformation?.['rewardsIds'];
                const rewardType = quest?.CustomInformation?.['rewardType'];
                const rewardRange = quest?.CustomInformation?.['rewardRange'];
                let included = false;
                let completed = false;
                if (claimingIds && activeCampaigns) {
                  included = checkInclusion(activeCampaigns, claimingIds);
                }
                if (rewardsIds && pastCampaigns) {
                  completed = checkInclusion(pastCampaigns, rewardsIds);
                }
                const baseURL = quest?.Image?.url;
                const imgURL = new URL(baseURL, url.origin);
                if (included) {
                  return (
                    <QuestCard
                      key={`active-superfest-mission-${index}`}
                      active={true}
                      title={quest?.Title}
                      image={String(imgURL)}
                      id={quest?.id}
                      label={quest?.Label}
                      points={quest?.Points}
                      link={quest?.Link}
                      startDate={quest?.StartDate}
                      endDate={quest?.EndDate}
                      platformName={quest?.quests_platform?.Name}
                      slug={quest?.Slug}
                      chains={quest?.CustomInformation?.['chains']}
                      completed={completed}
                      variableWeeklyAPY={
                        quest?.Points > 0 && rewardType === 'weekly'
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
        </SuperfestCarouselContainer>
      ) : null}
    </>
  );
};
