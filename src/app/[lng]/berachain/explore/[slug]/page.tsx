import { type Metadata } from 'next';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { BerachainExploreProtocol } from '@/components/Berachain/BerachainExploreProtocol';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { data } = await getQuestBySlug(params.slug);
    const questData = data || undefined;
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
      title: `Jumper Berachain | ${sliceStrToXChar(questData.attributes?.Title, 45)}`,
      description: `Description of ${questData.attributes?.Title}`,
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

  return <BerachainExploreProtocol marketId={params.slug} />;
}
