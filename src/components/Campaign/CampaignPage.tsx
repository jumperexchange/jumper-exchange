import { notFound } from 'next/navigation';
import { getCampaignBySlug } from 'src/app/lib/getCampaignsBySlug';
import { fetchQuestOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';
import { CampaignPageContent } from './CampaignPageContent';

interface CampaignPageProps {
  slug: string;
}

export async function CampaignPage({ slug }: CampaignPageProps) {
  const campaign = await getCampaignBySlug(slug);

  if (!campaign || !campaign.data || campaign.data.length === 0) {
    notFound();
  }

  const extendedQuests = await fetchQuestOpportunitiesByRewardsIds(
    campaign.data[0].quests,
  );

  return (
    <CampaignPageContent campaign={campaign.data[0]} quests={extendedQuests} />
  );
}
