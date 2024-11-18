import { type Metadata } from 'next';
import { siteName } from 'src/app/lib/metadata';
import BerachainExploreMarketPage from 'src/app/ui/berachain/BerachainExploreMarketPage';
import { berachainMarkets } from 'src/components/Berachain/const/berachainExampleData';
import { getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const beraMarket = await berachainMarkets.filter(
      (market) => market.protocol.slug === params.slug,
    );

    if (!beraMarket) {
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
      title: `Jumper Learn | ${sliceStrToXChar(beraMarket[0].protocol.name, 45)}`,
      description: `Description of ${beraMarket[0].protocol.name}`,
      alternates: {
        canonical: `${getSiteUrl()}/berachain/explore/${params.slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Learn | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the article "${params.slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page() {
  return <BerachainExploreMarketPage />;
}
