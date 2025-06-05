'use client';

import { useMemo } from 'react';
import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { Quest } from 'src/types/loyaltyPass';
import { MerklOpportunity } from 'src/types/merkl';

interface QuestPageProps {
  quest: Quest;
  merklOpportunities: MerklOpportunity[];
  taskOpportunities: Record<string, MerklOpportunity[]>;
}

const QuestPage = ({
  quest,
  merklOpportunities,
  taskOpportunities,
}: QuestPageProps) => {
  const { campaign } = quest;

  const path = useMemo(
    () =>
      campaign?.Slug
        ? `${JUMPER_CAMPAIGN_PATH}/${campaign.Slug}`
        : JUMPER_LOYALTY_PATH,
    [campaign?.Slug],
  );

  return (
    <QuestsMissionPage
      quest={quest}
      path={path}
      activeCampaign={campaign?.Title}
      merklOpportunities={merklOpportunities}
      taskOpportunities={taskOpportunities}
    />
  );
};

export default QuestPage;
