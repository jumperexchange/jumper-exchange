import { siteName } from '@/app/lib/metadata';
import BridgePage from '@/app/ui/bridge/BridgePage';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getTokensQuery } from '@/hooks/useTokens';
import {
  getChainByName,
  getTokenBySymbolOnSpecificChain,
} from '@/utils/tokenAndChain';
import { bridgeSegmentsSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = Promise<{ segments: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { segments } = await params;

    // Validate segments
    const result = bridgeSegmentsSchema.safeParse(segments);
    if (!result.success) {
      throw new Error('Invalid bridge segments');
    }

    const {
      sourceChain: sourceChainNameParam,
      sourceToken: sourceTokenSymbolParam,
      destinationChain: destinationChainNameParam,
      destinationToken: destinationTokenSymbolParam,
    } = result.data;

    const title = `Jumper | Best way to bridge from ${sourceTokenSymbolParam} on ${sourceChainNameParam} to ${destinationTokenSymbolParam} on ${destinationChainNameParam}`;

    const openGraph: Metadata['openGraph'] = {
      title: title,
      description: `Jumper offers the best way to do cross-chain bridging of ${sourceTokenSymbolParam} on ${sourceChainNameParam} to ${destinationTokenSymbolParam} on ${destinationChainNameParam} with the fastest speeds, lowest costs, and most secure bridge and swap providers available.`,
      siteName: siteName,
      url: `${getSiteUrl()}/bridge/${segments}`,
      type: 'article',
    };

    return {
      title,
      description: title,
      twitter: openGraph,
      openGraph,
      alternates: {
        canonical: `${getSiteUrl()}/bridge/${segments}`,
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

export default async function Page({ params }: { params: Params }) {
  try {
    const { segments } = await params;

    // Validate segments
    const result = bridgeSegmentsSchema.safeParse(segments);
    if (!result.success) {
      return notFound();
    }

    const {
      sourceChain: sourceChainNameParam,
      sourceToken: sourceTokenSymbolParam,
      destinationChain: destinationChainNameParam,
      destinationToken: destinationTokenSymbolParam,
    } = result.data;

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
    return notFound();
  }
}
