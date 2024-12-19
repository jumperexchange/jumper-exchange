import CampaignPage from 'src/app/ui/campaign/CampaignPage';
import { getQuestBySlug } from '../../../lib/getQuestBySlug';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);

  if (!data?.data?.[0]) {
    return notFound();
  }

  return <CampaignPage quest={data?.data?.[0]} url={url} />;
}
