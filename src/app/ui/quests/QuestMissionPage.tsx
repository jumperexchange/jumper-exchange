'use client';

import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_LOYALTY_PATH } from 'src/const/urls';

interface QuestPageProps {
  quest: any;
  url: string;
  merklOpportunities: CTALinkInt[];
  taskOpportunities: Record<string, CTALinkInt[]>;
}

const QuestPage = ({
  quest,
  url,
  merklOpportunities,
  taskOpportunities,
}: QuestPageProps) => {
  const path = quest.campaign?.Slug
    ? `${JUMPER_CAMPAIGN_PATH}/${quest.campaign.Slug}`
    : JUMPER_LOYALTY_PATH;

  return (
    <QuestsMissionPage
      quest={quest}
      baseUrl={url}
      path={path}
      activeCampaign={quest.campaign?.Title}
      merklOpportunities={merklOpportunities}
      taskOpportunities={taskOpportunities}
    />
  );
};

export default QuestPage;
