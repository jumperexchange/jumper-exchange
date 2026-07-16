import { notFound } from 'next/navigation';
import { getCampaignBySlugForPage } from '@/app/lib/campaign/cachedCampaignFetch';
import { CampaignPageContent } from './CampaignPageContent';

interface CampaignPageProps {
  slug: string;
}

export async function CampaignPage({ slug }: CampaignPageProps) {
  const campaign = await getCampaignBySlugForPage(slug);

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
