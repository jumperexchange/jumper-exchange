import { siteName } from '@/app/lib/metadata';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import { getChainByName } from '@/utils/tokenAndChain';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SwapPage from 'src/app/ui/swap/SwapPage';

type Params = Promise<{ segments: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { segments } = await params;

  const { chains } = await getChainsQuery();
  const sourceChain = getChainByName(chains, segments);
  const title = `Jumper | How To Swap on ${sourceChain?.name} | A Complete Guide`;

  const openGraph: Metadata['openGraph'] = {
    title: title,
    description: `Jumper offers the best way to swap tokens on ${sourceChain?.name} with the fastest speeds, lowest costs, and most secure swap providers available.`,
    siteName: siteName,
    url: `${getSiteUrl()}/swap/${segments.replace('-', ' ').toLowerCase()}`,
    type: 'article',
  };

  return {
    title,
    description: title,
    twitter: openGraph,
    openGraph,
    alternates: {
      canonical: `${getSiteUrl()}/swap/${segments}`,
    },
  };
}

export const revalidate = 86400;
export const dynamicParams = true; // or false, to 404 on unknown paths
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const { chains } = await getChainsQuery();

  return chains.map((chain) => ({
    segments: chain.name.replace(' ', '-').toLowerCase(),
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { segments } = await params;

  try {
    const chainName = decodeURIComponent(
      segments.replace('-', ' ').toLowerCase(),
    );
    const { chains } = await getChainsQuery();
    const { tokens } = await getTokensQuery();
    const sourceChain = getChainByName(chains, chainName);
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
        destinationChain={sourceChain}
        chainName={chainName}
        destinationToken={destinationToken}
        tokens={tokens}
      />
    );
  } catch (e) {
    notFound();
  }
}
