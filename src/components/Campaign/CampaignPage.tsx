import { notFound } from 'next/navigation';
import { getCampaignBySlug } from 'src/app/lib/getCampaignsBySlug';
import { CampaignPageContent } from './CampaignPageContent';

interface CampaignPageProps {
  slug: string;
}

export async function CampaignPage({ slug }: CampaignPageProps) {
  const campaign = await getCampaignBySlug(slug);

  if (!campaign || !campaign.data || campaign.data.length === 0) {
    notFound();
  }

  return (
    <CampaignPageContent
      campaign={campaign.data[0]}
      quests={campaign.data[0].quests}
    />
  );
}
