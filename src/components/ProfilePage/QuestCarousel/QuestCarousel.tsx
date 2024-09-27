import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { checkInclusion } from 'src/components/Superfest/ActiveSuperfestMissionsCarousel/ActiveSuperfestMissionsCarousel';
import type { OngoingRewardsItem } from 'src/hooks/useOngoingRewards';
import { useOngoingRewards } from 'src/hooks/useOngoingRewards';
import type { Quest } from 'src/types/loyaltyPass';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';
import { QuestCarouselContainer } from './QuestCarousel.style';

interface QuestCarouselProps {
  pastCampaigns?: string[];
}

export const QuestCarousel = ({ pastCampaigns }: QuestCarouselProps) => {
  const { t } = useTranslation();
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();
  const { data: ongoingRewards, isLoading: isOngoingRewardsLoading } =
    useOngoingRewards();
  const loading = isQuestsLoading || isOngoingRewardsLoading;
  const isNotLive = !loading && (!quests || quests.length === 0);

  const renderProgressCard = (quest: OngoingRewardsItem, index: number) => {
    return (
      <QuestCardDetailled
        key={`available-mission-${index}`}
        active={true}
        title={quest.name}
        image={quest.image}
        points={quest.points}
        rewardsProgress={{
          min: quest.min,
          max: quest.max,
          points: quest.points,
        }}
      />
    );
  };

  const renderQuestCard = (quest: Quest, index: number) => {
    const baseURL = quest.attributes.Image?.data?.attributes?.url;
    const imgURL = new URL(baseURL, url.origin);
    const rewards = quest.attributes.CustomInformation?.['rewards'];
    const rewardType = quest.attributes?.CustomInformation?.['rewardType'];
    const rewardRange = quest.attributes?.CustomInformation?.['rewardRange'];
    const chains = quest.attributes.CustomInformation?.['chains'];
    const claimingIds = quest.attributes?.CustomInformation?.['claimingIds'];
    const rewardsIds = quest.attributes?.CustomInformation?.['rewardsIds'];

    //todo: exclude in a dedicated helper function
    let completed = false;
    if (rewardsIds && pastCampaigns) {
      completed = checkInclusion(pastCampaigns, rewardsIds);
    }

    return (
      <QuestCardDetailled
        key={`available-mission-${index}`}
        active={true}
        title={quest?.attributes.Title}
        image={String(imgURL)}
        points={quest?.attributes.Points}
        link={quest?.attributes.Link}
        startDate={quest?.attributes.StartDate}
        endDate={quest?.attributes.EndDate}
        platformName={quest?.attributes.quests_platform?.data?.attributes?.Name}
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
  };

  return (
    !isNotLive && (
      <QuestCarouselContainer>
        <CarouselContainer title={t('missions.available')}>
          {loading ? (
            Array.from({ length: 3 }, (_, idx) => (
              <QuestCardSkeleton key={`mission-card-skeleton-${idx}`} />
            ))
          ) : (
            <>
              {quests?.map((quest: Quest, index: number) =>
                renderQuestCard(quest, index),
              )}
              {ongoingRewards &&
                !isOngoingRewardsLoading &&
                ongoingRewards.map((reward, index) =>
                  renderProgressCard(reward, index),
                )}
            </>
          )}
        </CarouselContainer>
      </QuestCarouselContainer>
    )
  );
};
