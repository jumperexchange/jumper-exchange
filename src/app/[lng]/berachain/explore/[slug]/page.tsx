import { type Metadata } from 'next';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import { berachainMarkets } from 'src/components/Berachain/const/berachainExampleData';
import { getSiteUrl } from 'src/const/urls';
import type { ExtendedQuest } from 'src/types/questDetails';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { notFound } from 'next/navigation';
import { useEnrichedMarkets } from 'royco/hooks';
import { BerachainExploreProtocol } from '@/components/Berachain/BerachainExploreProtocol';
import { useBerachainMarkets } from '@/components/Berachain/hooks/useBerachainMarkets';

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
      title: 'Jumper | Berachain',
      description: 'Dive into the Berachain universe!',
      siteName: siteName,
      url: `${getSiteUrl()}/berachain/explore/${params.slug}`,
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
      title: `Jumper Berachain | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: `Description of "${params.slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  // Royco hooks only works on client side so notFound not really possible from there :(
  // Have to rely on the hardcoded array

  // const { data, url, findFromStrapiByUid } = useBerachainMarkets();
  // const card = findFromStrapiByUid(param.slug)


  // const { data } = await getQuestBySlug(params.slug);
  // const questData = (data?.data?.[0] as ExtendedQuest) || undefined;
  //
  // if (!questData) {
  //   return notFound();
  // }
  //
  // if (questData) {
  //   const protocolDetails = berachainMarkets.filter(
  //     (market) => market.slug === questData.attributes.Slug,
  //   );
  //   questData.protocolInfos = protocolDetails[0];
  // }
  console.log('exporepagebera', params.slug)

  return <BerachainExploreProtocol marketId={params.slug} />;
}