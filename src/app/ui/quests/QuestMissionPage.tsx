import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import { QuestsMissionPage } from 'src/components/QuestPage/QuestsMissionPage';
import { JUMPER_CAMPAIGN_PATH, JUMPER_PROFILE_PATH } from 'src/const/urls';
import { Quest } from 'src/types/loyaltyPass';

interface QuestMissionPageProps {
  quest: Quest;
  merklOpportunities: MerklOpportunity[];
}

const QuestPage = ({ quest, merklOpportunities }: QuestMissionPageProps) => {
  const { campaign } = quest;

  const path = campaign?.Slug
    ? `${JUMPER_CAMPAIGN_PATH}/${campaign.Slug}`
    : JUMPER_PROFILE_PATH;

  return (
    <QuestsMissionPage
      quest={quest}
      merklOpportunities={merklOpportunities}
      path={path}
      activeCampaign={campaign?.Title}
    />
  );
};

export default QuestPage;
