import type { QuestDataExtended } from 'src/types/merkl';
import type { CampaignData } from 'src/types/strapi';
import { CampaignHero } from './CampaignHero/CampaignHero';
import { MissionsSection } from './MissionsSection/MissionsSection';
import { MissionsList } from './MissionsSection/MissionsList';
import { GridContainer } from '../Containers/GridContainer';
import { PageContainer } from '../Containers/PageContainer';

interface CampaignPageContentProps {
  campaign: CampaignData;
  quests: QuestDataExtended[];
}

export const CampaignPageContent = ({
  campaign,
  quests,
}: CampaignPageContentProps) => {
  return (
    <PageContainer>
      <CampaignHero campaign={campaign} />

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
