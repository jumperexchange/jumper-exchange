'use client';
import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';

interface QuestMissionPageProps {
  quest: Quest;
  merklOpportunities: MerklOpportunity[];
  tasksVerification: TaskVerificationWithApy[];
}

const QuestPage = ({
  quest,
  merklOpportunities,
  tasksVerification,
}: QuestMissionPageProps) => {
  const { campaign } = quest;

  const path = campaign?.Slug
    ? `${JUMPER_CAMPAIGN_PATH}/${campaign.Slug}`
    : JUMPER_LOYALTY_PATH;

  return (
    <QuestsMissionPage
      quest={quest}
      tasksVerification={tasksVerification}
      merklOpportunities={merklOpportunities}
      path={path}
      activeCampaign={campaign?.Title}
    />
  );
};

export default QuestPage;
