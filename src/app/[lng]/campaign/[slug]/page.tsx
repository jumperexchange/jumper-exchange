import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCampaigns } from 'src/app/lib/getCampaigns';
import { getCampaignBySlug } from 'src/app/lib/getCampaignsBySlug';
import { siteName } from 'src/app/lib/metadata';
import { CampaignPage } from 'src/components/Campaign/CampaignPage';
import { getSiteUrl } from 'src/const/urls';
import { fetchQuestOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

// Add generateStaticParams function
export async function generateStaticParams() {
  const { data } = await getCampaigns();

  if (!data) {
    return [];
  }

  return data.map((campaign) => ({
    slug: campaign.Slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const campaign = await getCampaignBySlug(slug);

    if (!campaign || !campaign.data || campaign.data.length === 0) {
      throw new Error(`Campaign for ${slug} not found`);
    }

    const campaignData = campaign.data[0];

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Campaign | ${sliceStrToXChar(campaignData.Title, 45)}`,
      description: `${sliceStrToXChar(campaignData.Description, 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/campaign/${slug}`,
      type: 'article',
    };

    return {
      title: `Jumper Campaign | ${sliceStrToXChar(campaignData.Title, 45)}`,
      description: campaignData.Description,
      alternates: {
        canonical: `${getSiteUrl()}/campaign/${slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    notFound();
  }
}

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign || !campaign.data || campaign.data.length === 0) {
    notFound();
  }

  const extendedQuests = await fetchQuestOpportunitiesByRewardsIds(
    campaign.data[0].quests,
  );
  return <CampaignPage campaign={campaign.data[0]} quests={extendedQuests} />;
}
