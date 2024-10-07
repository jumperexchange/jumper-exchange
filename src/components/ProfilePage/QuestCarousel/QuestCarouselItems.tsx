import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { checkInclusion } from 'src/components/Superfest/ActiveSuperfestMissionsCarousel/ActiveSuperfestMissionsCarousel';
import type { Quest } from 'src/types/loyaltyPass';
import { QuestCardSkeleton } from '../QuestCard/QuestCardSkeleton';
import { QuestCardDetailled } from '../QuestCardDetailled/QuestCardDetailled';

interface QuestCarouselProps {
  pastCampaigns?: string[];
}

export const QuestCarouselItems = ({ pastCampaigns }: QuestCarouselProps) => {
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();

  return !isQuestsLoading
    ? quests?.map((quest: Quest, index: number) => {
        const baseURL = quest.attributes.Image?.data?.attributes?.url;
        const imgURL = new URL(baseURL, url.origin);
        const rewards = quest.attributes.CustomInformation?.['rewards'];
        const rewardType = quest.attributes?.CustomInformation?.['rewardType'];
        const rewardRange =
          quest.attributes?.CustomInformation?.['rewardRange'];
        const chains = quest.attributes.CustomInformation?.['chains'];
        const claimingIds =
          quest.attributes?.CustomInformation?.['claimingIds'];
        const rewardsIds = quest.attributes?.CustomInformation?.['rewardsIds'];

        //todo: exclude in a dedicated helper function
        let completed = false;
        if (rewardsIds && pastCampaigns) {
          completed = checkInclusion(pastCampaigns, rewardsIds);
        }

        return (
          <QuestCardDetailled
            key={`available-mission-${index}`}
            title={quest?.attributes.Title}
            image={String(imgURL)}
            points={quest?.attributes.Points}
            link={quest?.attributes.Link}
            startDate={quest?.attributes.StartDate}
            endDate={quest?.attributes.EndDate}
            platformName={
              quest?.attributes.quests_platform?.data?.attributes?.Name
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
    : Array.from({ length: 3 }, (_, idx) => (
        <QuestCardSkeleton
          key={`mission-card-skeleton-${idx}`}
          sx={{ width: 288, height: 436, borderRadius: '8px' }}
        />
      ));
};
