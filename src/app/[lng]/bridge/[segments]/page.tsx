import { siteName } from '@/app/lib/metadata';
import BridgePage from '@/app/ui/bridge/BridgePage';
import { getSiteUrl } from '@/const/urls';
import { resolveBridgeRoute } from '@/utils/bridge/resolveBridgeRoute';
import { slugToDisplayLabel } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = Promise<{ segments: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { segments } = await params;
  const route = await resolveBridgeRoute(segments);

  if (!route) {
    notFound();
  }

  const sourceTokenSymbol = route.sourceTokenSymbolParam.toUpperCase();
  const sourceChain = slugToDisplayLabel(route.sourceChainNameParam);
  const destinationTokenSymbol =
    route.destinationTokenSymbolParam.toUpperCase();
  const destinationChain = slugToDisplayLabel(route.destinationChainNameParam);

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
}

// Bridge pages are SEO landing pages with effectively static content, so they
// only need to refresh once a month. Trigger an earlier refresh manually with
// on-demand revalidation (revalidatePath/revalidateTag) when content changes.
export const revalidate = 2592000; // 30 days
export const dynamicParams = true;
export const dynamic = 'force-static';

// Prerender nothing at build time (the full pair matrix added ~15 min to the
// build); generate each URL on first request and cache it (ISR).
export function generateStaticParams() {
  return [];
}

export default async function Page({ params }: { params: Params }) {
  const { segments } = await params;
  const route = await resolveBridgeRoute(segments);

  if (!route) {
    return notFound();
  }

  return (
    <BridgePage
      sourceChain={route.sourceChain}
      sourceToken={route.sourceToken}
      destinationChain={route.destinationChain}
      destinationToken={route.destinationToken}
      chains={route.chains}
    />
  );
}
