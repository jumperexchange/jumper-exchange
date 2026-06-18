import type { CampaignData, QuestData } from 'src/types/strapi';
import { CampaignHero } from './CampaignHero/CampaignHero';
import { MissionsSection } from './MissionsSection/MissionsSection';
import { MissionsList } from './MissionsSection/MissionsList';
import { GridContainer } from '../Containers/GridContainer';
import { PageContainer } from '../Containers/PageContainer';
import { RewardsSection } from '../ProfilePage/sections/RewardsSection';

interface CampaignPageContentProps {
  campaign: CampaignData;
  quests: QuestData[];
}

export const CampaignPageContent = ({
  campaign,
  quests,
}: CampaignPageContentProps) => {
  return (
    <PageContainer>
      <CampaignHero campaign={campaign} />

      <RewardsSection jumperCampaignId={campaign.documentId} />

      {!!quests.length && (
        <MissionsSection>
          <GridContainer gridTemplateColumns="repeat(auto-fill, minmax(min(320px, 100%), 1fr))">
            <MissionsList missions={quests} />
          </GridContainer>
        </MissionsSection>
      )}
    </PageContainer>
  );
};
