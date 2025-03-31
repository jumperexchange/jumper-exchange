import { siteName } from '@/app/lib/metadata';
import BridgePage from '@/app/ui/bridge/BridgePage';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import {
  getChainByName,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import {
  bridgeSegmentsSchema,
  chainNameSchema,
} from '@/utils/validation-schemas';
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

  // Validate chain names
  const sourceChainResult = chainNameSchema.safeParse(sourceChain);
  const destinationChainResult = chainNameSchema.safeParse(destinationChain);

  if (!sourceChainResult.success || !destinationChainResult.success) {
    throw new Error('Invalid chain name format');
  }

  return [sourceChain, sourceToken, destinationChain, destinationToken];
}

export async function generateMetadata({
  params,
}: {
  params: { segments: string };
}): Promise<Metadata> {
  try {
    // Validate segments
    const result = bridgeSegmentsSchema.safeParse(params.segments);
    if (!result.success) {
      throw new Error('Invalid bridge segments');
    }

    const { sourceChain, sourceToken, destinationChain, destinationToken } =
      result.data;

    const title = `Jumper | Best way to bridge from ${sourceToken} on ${sourceChain} to ${destinationToken} on ${destinationChain}`;

    const openGraph: Metadata['openGraph'] = {
      title: title,
      description: `Jumper offers the best way to do cross-chain bridging of ${sourceToken} on ${sourceChain} to ${destinationToken} on ${destinationChain} with the fastest speeds, lowest costs, and most secure bridge and swap providers available.`,
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
  } catch (err) {
    return {
      title: 'Jumper | Cross-Chain Bridge',
      description:
        'Jumper offers the best way to bridge tokens across different blockchains with the fastest speeds, lowest costs, and most secure bridge providers.',
      alternates: {
        canonical: `${getSiteUrl()}/bridge`,
      },
    };
  }
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
    // Validate segments
    const result = bridgeSegmentsSchema.safeParse(segments);
    if (!result.success) {
      return notFound();
    }

    const { sourceChain, sourceToken, destinationChain, destinationToken } =
      result.data;

    const { chains } = await getChainsQuery();
    const { tokens } = await getTokensQuery();

    const sourceChainData = getChainByName(chains, sourceChain);
    const sourceTokenData = getTokenBySymbolOnSpecificChain(
      tokens,
      sourceChainData?.id ?? 0,
      sourceToken,
    );
    const destinationChainData = getChainByName(chains, destinationChain);
    const destinationTokenData = getTokenBySymbolOnSpecificChain(
      tokens,
      destinationChainData?.id ?? 0,
      destinationToken,
    );

    if (
      !sourceChainData ||
      !sourceTokenData ||
      !destinationChainData ||
      !destinationTokenData
    ) {
      return notFound();
    }

    return (
      <BridgePage
        sourceChain={sourceChainData}
        sourceToken={sourceTokenData}
        destinationChain={destinationChainData}
        destinationToken={destinationTokenData}
        chains={chains}
        tokens={tokens}
      />
    );
  } catch (e) {
    return notFound();
  }
}
