import { getCampaignsForPage } from '@/app/lib/campaign/cachedCampaignFetch';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCampaignBySlugForPage } from '@/app/lib/campaign/cachedCampaignFetch';
import { siteName } from 'src/app/lib/metadata';
import { CampaignPage } from '@/components/Campaign/CampaignPage';
import { CampaignPageSkeleton } from 'src/components/Campaign/CampaignPageSkeleton';
import { getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

// Add generateStaticParams function
export async function generateStaticParams() {
  const { data } = await getCampaignsForPage();

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
}) {
  const { slug } = await params;

  try {
    const campaign = await getCampaignBySlugForPage(slug);

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
      other: {
        'partner-theme': slug,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {};
  }
}

type Params = Promise<{ slug: string }>;

async function CampaignPageLoader({ params }: { params: Params }) {
  const { slug } = await params;
  return <CampaignPage slug={slug} />;
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<CampaignPageSkeleton />}>
      <CampaignPageLoader params={params} />
    </Suspense>
  );
}
