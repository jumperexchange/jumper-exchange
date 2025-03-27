import { siteName } from '@/app/lib/metadata';
import BridgePage from '@/app/ui/bridge/BridgePage';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import {
  getChainByName,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

function parseString(url: string): [string, string, string, string] {
  // First, split the string into the source part and the destination part using 'to'
  const [sourcePart, destinationPart] = url.split('-to-');

  if (!sourcePart || !destinationPart) {
    throw new Error(
      'Invalid format. Expected format: sourceChain-sourceToken-to-destinationChain-destinationToken',
    );
  }

  // Split the source part into chain and token
  const sourceSplit = sourcePart.split('-');
  const destinationSplit = destinationPart.split('-');

  // Source Chain will always be the first element, and the rest is the token
  const sourceChain = sourceSplit[0];
  const sourceToken = sourceSplit.slice(1).join('-'); // Join the rest back in case of dashes in the token name

  // Destination Chain will always be the first element of the destination part, and the rest is the token
  const destinationChain = destinationSplit[0];
  const destinationToken = destinationSplit.slice(1).join('-'); // Join the rest back for destination token

  return [sourceChain, sourceToken, destinationChain, destinationToken];
}
export async function generateMetadata({
  params,
}: {
  params: { segments: string };
}): Promise<Metadata> {
  const [sourceChain, sourceTokenName, destinationChain, destinationTokenName] =
    parseString(params.segments);

  const title = `Jumper | Best way to bridge from ${sourceTokenName} on ${sourceChain} to ${destinationTokenName} on ${destinationChain}`;

  const openGraph: Metadata['openGraph'] = {
    title: title,
    description: `Jumper offers the best way to do cross-chain bridging of ${sourceTokenName} on ${sourceChain} to ${destinationTokenName} on ${destinationChain} with the fastest speeds, lowest costs, and most secure bridge and swap providers available.`,
    siteName: siteName,
    url: `${getSiteUrl()}/bridge/${params.segments}`,
    type: 'article',
  };

  return {
    title,
    description: title,
    twitter: openGraph,
    openGraph,
    alternates: {
      canonical: `${getSiteUrl()}/bridge/${params.segments}`,
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
    const [
      sourceChainNameParam,
      sourceTokenSymbolParam,
      destinationChainNameParam,
      destinationTokenSymbolParam,
    ] = parseString(decodeURIComponent(segments));

    const { chains } = await getChainsQuery();
    const { tokens } = await getTokensQuery();

    const sourceChain = getChainByName(chains, sourceChainNameParam);
    const sourceToken = getTokenBySymbolOnSpecificChain(
      tokens,
      sourceChain?.id ?? 0,
      sourceTokenSymbolParam,
    );
    const destinationChain = getChainByName(chains, destinationChainNameParam);
    const destinationToken = getTokenBySymbolOnSpecificChain(
      tokens,
      destinationChain?.id ?? 0,
      destinationTokenSymbolParam,
    );

    if (
      !sourceChain ||
      !sourceToken ||
      !destinationChain ||
      !destinationToken
    ) {
      return notFound();
    }

    return (
      <BridgePage
        sourceChain={sourceChain}
        sourceToken={sourceToken}
        destinationChain={destinationChain}
        destinationToken={destinationToken}
        chains={chains}
        tokens={tokens}
      />
    );
  } catch (e) {
    notFound();
  }
}
