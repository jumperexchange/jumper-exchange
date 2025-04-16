import { useTranslation } from 'react-i18next';
import type { QuestData } from 'src/types/strapi';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { checkInclusion } from '../checkInclusion';
import { QuestCard } from '../QuestCard/QuestCard';
import {
  QuestsOverviewContainer,
  QuestsOverviewTitle,
} from './QuestsOverview.style';

interface QuestOverviewProps {
  quests: QuestData[];
  pastCampaigns?: string[];
  traits?: string[];
  // traits?: Trait[];
  label?: string;
}

export const QuestsOverview = ({
  quests,
  pastCampaigns,
  traits,
  label,
}: QuestOverviewProps) => {
  const { t } = useTranslation();
  const baseUrl = getStrapiBaseUrl();
  return (
    <QuestsOverviewContainer>
      <QuestsOverviewTitle variant="headerMedium">
        {t('missions.available')}
      </QuestsOverviewTitle>
      {/** render quests */}
      {quests.map((quest, index: number) => {
        const imgUrl = quest?.Image?.url;
        const imgURL = imgUrl && new URL(imgUrl, baseUrl);
        const rewards = quest?.CustomInformation?.['rewards'];
        const rewardType = quest?.CustomInformation?.['rewardType'];
        const rewardRange = quest?.CustomInformation?.['rewardRange'];
        const chains = quest?.CustomInformation?.['chains'];
        const claimingIds = quest?.CustomInformation?.['claimingIds'];
        const rewardsIds = quest?.CustomInformation?.['rewardsIds'];
        const questTraits = quest?.CustomInformation?.['traits'];
        const endDate = quest?.EndDate;
        const startDate = quest?.StartDate;
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
          title: quest?.Title,
          active: true,
          image: imgURL ? String(imgURL) : undefined,
          points: quest?.Points ?? undefined,
          ctaLink: quest?.Link,
          url: quest?.Slug,
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
            quest.Points && quest?.Points > 0 && rewardType === 'weekly'
              ? true
              : undefined,
          rewardRange: rewardRange,
          isTraitsGarded: questTraits && questTraits?.length > 0,
          isUnlocked: isUnlockedForUser,
          hideXPProgressComponents: true,
        };

        return <QuestCard key={`available-mission-${index}`} data={data} />;
      })}
      {/** render ongoing numeric quests */}
      {/* <QuestCarouselNumericItems /> */}
    </QuestsOverviewContainer>
  );
};
