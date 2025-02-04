import { useTranslation } from 'react-i18next';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import type { Quest } from 'src/types/loyaltyPass';
import { checkInclusion } from '../checkInclusion';
import { QuestCard } from '../QuestCard/QuestCard';
import {
  QuestsOverviewContainer,
  QuestsOverviewTitle,
} from './QuestsOverview.style';

interface QuestCarouselProps {
  pastCampaigns?: string[];
  traits?: string[];
  // traits?: Trait[];
  label?: string;
}

export const QuestsOverview = ({
  pastCampaigns,
  traits,
  label,
}: QuestCarouselProps) => {
  const { t } = useTranslation();
  const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests(label);

  return (
    <QuestsOverviewContainer>
      <QuestsOverviewTitle variant="headerMedium">
        {t('missions.available')}
      </QuestsOverviewTitle>
      {/** render quests */}
      {!isQuestsLoading
        ? quests?.map((quest: Quest, index: number) => {
            const baseURL = quest?.attributes?.Image?.data?.attributes?.url;
            const imgURL = baseURL && new URL(baseURL, url.origin);
            const rewards = quest?.attributes?.CustomInformation?.['rewards'];
            const rewardType =
              quest?.attributes?.CustomInformation?.['rewardType'];
            const rewardRange =
              quest?.attributes?.CustomInformation?.['rewardRange'];
            const chains = quest?.attributes?.CustomInformation?.['chains'];
            const claimingIds =
              quest?.attributes?.CustomInformation?.['claimingIds'];
            const rewardsIds =
              quest?.attributes?.CustomInformation?.['rewardsIds'];
            const questTraits =
              quest?.attributes?.CustomInformation?.['traits'];
            const endDate = quest?.attributes?.EndDate;
            const startDate = quest?.attributes?.StartDate;
            //todo: exclude in a dedicated helper function
            let completed = false;
            if (rewardsIds && pastCampaigns) {
              completed = checkInclusion(pastCampaigns, rewardsIds);
            }

            let isUnlockedForUser = false;
            if (questTraits && questTraits?.length > 0 && traits) {
              isUnlockedForUser = checkInclusion(traits, questTraits);
              // isUnlockedForUser = false;
            }

            const data = {
              title: quest?.attributes?.Title,
              active: true,
              image: String(imgURL),
              points: quest?.attributes?.Points,
              ctaLink: quest?.attributes?.Link,
              url: quest?.attributes?.Slug,
              // platformName:
              //   quest?.attributes?.quests_platform?.data?.attributes?.Name
              // ,
              startDate: startDate,
              endDate: endDate,
              chains: chains,
              rewards: rewards,
              completed: completed,
              claimingIds: claimingIds,
              variableWeeklyAPY:
                quest?.attributes?.Points > 0 && rewardType === 'weekly',
              rewardRange: rewardRange,
              isTraitsGarded: questTraits && questTraits?.length > 0,
              isUnlocked: isUnlockedForUser,
            };

            return <QuestCard key={`available-mission-${index}`} data={data} />;
          })
        : Array.from({ length: 8 }, (_, idx) => (
            <QuestCard
              key={`mission-card-skeleton-${idx}`}
              data={{ isLoading: true }}
            />
          ))}
      {/** render ongoing numeric quests */}
      {/* <QuestCarouselNumericItems /> */}
    </QuestsOverviewContainer>
  );
};
