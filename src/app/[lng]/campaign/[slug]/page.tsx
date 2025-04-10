import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCampaignBySlug } from 'src/app/lib/getCampaignsBySlug';
import { siteName } from 'src/app/lib/metadata';
import { CampaignPage } from 'src/components/Campaign/CampaignPage';
import { getSiteUrl, JUMPER_LOYALTY_PATH } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

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
    return {
      title: `Jumper Campaign | ${sliceStrToXChar(slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the campaign "${slug.replaceAll('-', ' ')}".`,
    };
  }
}

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign || !campaign.data || campaign.data.length === 0) {
    notFound();
  }

  return (
    <CampaignPage campaign={campaign.data[0]} path={JUMPER_LOYALTY_PATH} />
  );
}
