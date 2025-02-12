import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from 'src/const/urls';
import type { Quest, QuestAttributes } from 'src/types/loyaltyPass';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { getQuestBySlug } from '../../../lib/getQuestBySlug';
import QuestPage from '../../../ui/quests/QuestMissionPage';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const quest = await getQuestBySlug(params.slug);

    if (!quest || !quest.data) {
      throw new Error();
    }

    const questData = quest.data;

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
      description: `${sliceStrToXChar(questData.Information || 'Quest description', 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/quests/${params.slug}`,
      images: [
        {
          url: `${quest.url}${questData.Image?.url}`,
          width: 900,
          height: 450,
          alt: 'banner image',
        },
      ],
      type: 'article',
    };

    return {
      title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
      description: questData.Subtitle,
      alternates: {
        canonical: `${getSiteUrl()}/quests/${params.slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Quest | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the quest "${params.slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);
  if (!data) {
    return notFound();
  }
  return <QuestPage quest={data} url={url} />;
}
