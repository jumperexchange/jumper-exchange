import { type Metadata } from 'next';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { BerachainExploreProtocol } from '@/components/Berachain/BerachainExploreProtocol';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getQuestBySlug(slug);
    const questData = data;
    if (!questData) {
      throw new Error();
    }

    const openGraph: Metadata['openGraph'] = {
      title: 'Jumper | Berachain',
      description: 'Dive into the Berachain universe!',
      siteName: siteName,
      url: `${getSiteUrl()}/berachain/explore/${slug}`,
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
      title: `Jumper Berachain | ${sliceStrToXChar(questData?.Title, 45)}`,
      description: `Description of ${questData?.Title}`,
      alternates: {
        canonical: `${getSiteUrl()}/berachain/explore/${slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Berachain | ${sliceStrToXChar(slug.replaceAll('-', ' '), 45)}`,
      description: `Description of "${slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  // Royco hooks only works on client side so notFound not really possible from there :(
  // Have to rely on the hardcoded array

  return <BerachainExploreProtocol marketId={slug} />;
}
