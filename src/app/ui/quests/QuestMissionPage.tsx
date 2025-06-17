'use client';

import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_PROFILE_PATH } from 'src/const/urls';
import { Quest } from 'src/types/loyaltyPass';

interface QuestPageProps {
  quest: Quest;
}

const QuestPage = ({ quest }: QuestPageProps) => {
  const path = quest.campaign?.Slug
    ? `${JUMPER_CAMPAIGN_PATH}/${quest.campaign.Slug}`
    : JUMPER_PROFILE_PATH;

  return (
    <QuestsMissionPage
      quest={quest}
      path={path}
      activeCampaign={quest.campaign?.Title}
    />
  );
};

export default QuestPage;
