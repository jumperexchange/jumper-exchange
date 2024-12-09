import { siteName } from '@/app/lib/metadata';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import { getChainById } from '@/utils/tokenAndChain';
import type { ChainId } from '@lifi/sdk';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SwapPage from 'src/app/ui/swap/SwapPage';

export async function generateMetadata({
  params,
}: {
  params: { segments: string };
}): Promise<Metadata> {
  const { chains } = await getChainsQuery();
  const sourceChain = getChainById(
    chains,
    parseInt(params.segments) as unknown as ChainId,
  );
  const title = `Jumper | How To Swap on ${sourceChain?.name} | A Complete Guide`;

  const openGraph: Metadata['openGraph'] = {
    title: title,
    description: `Jumper offers the best way to swap tokenA to tokenB on ${sourceChain?.name} with the fastest speeds, lowest costs, and most secure swap providers available.`,
    siteName: siteName,
    url: `${getSiteUrl()}/swap/${params.segments}`,
    type: 'article',
  };

  return {
    title,
    description: title,
    twitter: openGraph,
    openGraph,
    alternates: {
      canonical: `${getSiteUrl()}/swap/${params.segments}`,
    },
  };
}

export const revalidate = 86400;
export const dynamicParams = true; // or false, to 404 on unknown paths
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

export default async function Page({
  params: { segments },
}: {
  params: { segments: string };
}) {
  try {
    const sourceChainId = decodeURIComponent(segments);
    const { chains } = await getChainsQuery();
    const { tokens } = await getTokensQuery();
    const sourceChain = getChainById(
      chains,
      parseInt(sourceChainId) as unknown as ChainId,
    );

    if (!sourceChain) {
      return notFound();
    }

    const chainTokens = tokens[sourceChain.id];
    let sourceToken, destinationToken;
    if (chainTokens) {
      sourceToken = chainTokens[0];
      destinationToken = chainTokens[1];
    }

    return (
      <SwapPage
        sourceChain={sourceChain}
        sourceToken={sourceToken}
        destinationToken={destinationToken}
        tokens={tokens}
      />
    );
  } catch (e) {
    notFound();
  }
}
