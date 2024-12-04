import { type Metadata } from 'next';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import ZapPage from 'src/app/ui/zap/ZapPage';
import { zapMarkets } from 'src/components/Zap/zapExampleData';
import { getSiteUrl } from 'src/const/urls';
import type { ExtendedQuest } from 'src/types/questDetails';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { data } = await getQuestBySlug(params.slug);
    const questData = data.data[0] || undefined;
    if (!questData) {
      throw new Error();
    }

    const openGraph: Metadata['openGraph'] = {
      title: 'Jumper | Zap',
      description: 'Use zapping on Jumper',
      siteName: siteName,
      url: `${getSiteUrl()}/zap/${params.slug}`,
      // images: [
      //   {
      //     url: `${article.url}${articleData.Image.data.attributes?.url}`,
      //     width: 900,
      //     height: 450,
      //     alt: 'banner image',
      //   },
      // ],
      // type: 'article',
    };

    return {
      title: `Jumper Berachain | ${sliceStrToXChar(questData.attributes.Title, 45)}`,
      description: `Description of ${questData.attributes.Title}`,
      alternates: {
        canonical: `${getSiteUrl()}/berachain/explore/${params.slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Zapping | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for zapping "${params.slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data } = await getQuestBySlug(params.slug);
  const questData = (data.data[0] as ExtendedQuest) || undefined;

  if (questData) {
    const protocolDetails = zapMarkets.filter(
      (market) => market.slug === questData.attributes.Slug,
    );
    questData.protocolInfos = protocolDetails[0];
  }

  return <ZapPage market={questData} />;
}
