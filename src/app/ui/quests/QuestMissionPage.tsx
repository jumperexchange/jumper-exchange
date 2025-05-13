'use client';

import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_LOYALTY_PATH } from 'src/const/urls';

const QuestPage = ({ quest, url }: any) => {
  const path = quest.campaign?.Slug
    ? `${JUMPER_CAMPAIGN_PATH}/${quest.campaign.Slug}`
    : JUMPER_LOYALTY_PATH;

  return (
    <QuestsMissionPage
      quest={quest}
      baseUrl={url}
      path={path}
      activeCampaign={quest.campaign?.Title}
    />
  );
};

export default QuestPage;
