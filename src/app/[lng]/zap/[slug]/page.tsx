import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import ZapPage from 'src/app/ui/zap/ZapPage';
import { getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const quest = await getQuestBySlug(slug);
    const questData = quest?.data;

    if (!quest || !questData) {
      throw new Error();
    }

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper | Zaps - ${sliceStrToXChar(questData.Title, 45)}`,
      description: `${sliceStrToXChar(questData.Information || 'Zap description', 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/zap/${slug}`,
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
      title: `Jumper | Zaps - ${sliceStrToXChar(questData.Title, 45)}`,
      description: questData.Subtitle,
      alternates: {
        canonical: `${getSiteUrl()}/zap/${slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper | Zaps - ${sliceStrToXChar(slug.replaceAll('-', ' '), 45)}`,
      description: 'Use Jumper to zap into DeFi protocols',
    };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  // const { data } = await getQuestBySlug(params.slug, 'ExtendedQuest');
  const { data } = await getQuestBySlug(slug);

  if (!data) {
    return notFound();
  }

  return <ZapPage market={data} />;
}
