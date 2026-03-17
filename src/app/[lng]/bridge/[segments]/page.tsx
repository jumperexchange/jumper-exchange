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
  slugToDisplayLabel,
  slugToLabel,
} from '@/utils/validation-schemas';
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

    const sourceTokenSymbol = sourceTokenSymbolParam.toUpperCase();
    const sourceChain = slugToDisplayLabel(sourceChainNameParam);
    const destinationTokenSymbol = destinationTokenSymbolParam.toUpperCase();
    const destinationChain = slugToDisplayLabel(destinationChainNameParam);

    const title = `Jumper | Best way to bridge from ${sourceTokenSymbol} on ${sourceChain} to ${destinationTokenSymbol} on ${destinationChain}`;

    const openGraph: Metadata['openGraph'] = {
      title: title,
      description: `Jumper offers the best way to do cross-chain bridging of ${sourceTokenSymbol} on ${sourceChain} to ${destinationTokenSymbol} on ${destinationChain} with the fastest speeds, lowest costs, and most secure bridge and swap providers available.`,
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
export const dynamic = 'force-dynamic'; // otherwise it will block the pod as there will be too many static pages

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

    const [{ chains }, tokens] = await Promise.all([
      getChainsQuery(),
      getTokensQuery(),
    ]);

    const sourceChain = getChainByName(
      chains,
      slugToLabel(sourceChainNameParam),
    );
    const sourceToken = getTokenBySymbolOnSpecificChain(
      tokens,
      sourceChain?.id ?? 0,
      sourceTokenSymbolParam,
    );
    const destinationChain = getChainByName(
      chains,
      slugToLabel(destinationChainNameParam),
    );
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
