import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import ZapPage from 'src/app/ui/zap/ZapPage';
import { getSiteUrl } from 'src/const/urls';
import type { QuestAttributes } from 'src/types/loyaltyPass';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const quest = await getQuestBySlug(params.slug);

    if (!quest || !quest) {
      throw new Error();
    }

    const questData = quest.data?.attributes as QuestAttributes;

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper | Zaps - ${sliceStrToXChar(questData.Title, 45)}`,
      description: `${sliceStrToXChar(questData.Information || 'Zap description', 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/zap/${params.slug}`,
      images: [
        {
          url: `${quest.url}${questData.Image.data.attributes?.url}`,
          width: 900,
          height: 450,
          alt: 'banner image',
        },
      ],
      type: 'article',
    };

    return {
      title: `Jumper | Zaps - ${sliceStrToXChar(questData.Title, 45)}`,
      description: questData.Subtitle,
      alternates: {
        canonical: `${getSiteUrl()}/zap/${params.slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper | Zaps - ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: 'Use Jumper to zap into DeFi protocols',
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  // const { data } = await getQuestBySlug(params.slug, 'ExtendedQuest');
  const { data } = await getQuestBySlug(params.slug);

  if (!data) {
    return notFound();
  }

  return <ZapPage market={data} />;
}
