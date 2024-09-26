import BridgePage from '@/app/ui/bridge/BridgePage';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import { notFound } from 'next/navigation';
import {
  getChainByName,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import type { Token } from '@lifi/sdk';

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
/*
export async function generateMetadata({
  params,
}: {
  params: { segments: string };
}): Promise<Metadata> {
  const [
    sourceChain,
    sourceTokenName,
    destinationChain,
    destinationTokenName,
  ] = parseString(params.segments);

  const title = `Jumper | Bridge ${sourceTokenName} on ${sourceChain} to ${destinationTokenName} on ${destinationChain}`;

  const openGraph: Metadata['openGraph'] = {
    title: title,
    description: `${sliceStrToXChar(title, 60)}`,
    siteName: siteName,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/bridge/${params.segments}`,
    /!*      images: [
            {
              url: `${article.url}${articleData.Image.data.attributes?.url}`,
              width: 900,
              height: 450,
              alt: 'banner image',
            },
          ],*!/
    type: 'article',
  };

  return {
    title,
    description: title,
    twitter: openGraph,
    openGraph,
  };
}*/

//Optimized function to generate ordered bridge pairs (tokens from different chains)
const generateBridgeOrderedPairs = (tokens: Token[]) => {
  const orderedPairs: Array<[Token, Token]> = [];

  // Loop through each token and compare with every other token
  for (const token1 of tokens) {
    for (const token2 of tokens) {
      // Ensure tokens are from different chains (bridge rule)
      if (token1.chainId !== token2.chainId) {
        orderedPairs.push([token1, token2]); // Token1 -> Token2
      }
    }
  }

  return orderedPairs;
};

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

    if (!sourceChain || !sourceToken || !destinationChain || !destinationToken) {
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
