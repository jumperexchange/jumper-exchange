import type { QuestDataExtended } from 'src/types/merkl';
import type { CampaignData } from 'src/types/strapi';
import { CampaignHero } from './CampaignHero/CampaignHero';
import { MissionsSection } from './MissionsSection/MissionsSection';
import { MissionsList } from './MissionsSection/MissionsList';
import { GridContainer } from '../Containers/GridContainer';
import { PageContainer } from '../Containers/PageContainer';
import { RewardsSection } from '../ProfilePage/sections/RewardsSection';

interface CampaignPageProps {
  campaign: CampaignData;
  quests: QuestDataExtended[];
}

export const CampaignPage = ({ campaign, quests }: CampaignPageProps) => {
  const merklRewards = campaign.merkl_rewards;
  return (
    <PageContainer>
      <CampaignHero campaign={campaign} />

      <RewardsSection merklRewards={merklRewards} />

      {!!quests.length && (
        <MissionsSection>
          <GridContainer>
            <MissionsList missions={quests} />
          </GridContainer>
        </MissionsSection>
      )}
    </PageContainer>
  );
};
