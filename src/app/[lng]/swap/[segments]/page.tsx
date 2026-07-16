import { siteName } from '@/app/lib/metadata';
import { getSiteUrl } from '@/const/urls';
import { getChainsQuery } from '@/hooks/useChains';
import { getChainByName } from '@/utils/tokenAndChain';
import { slugify } from '@/utils/urls/slugify';
import { chainNameSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';
import SwapPage from 'src/app/ui/swap/SwapPage';
import { WidgetPageSkeleton } from '@/app/ui/shared/WidgetPageSkeleton';
import { Suspense } from 'react';

type Params = Promise<{ segments: string }>;

async function getChainsForPage() {
  'use cache';
  cacheLife({ revalidate: 86400 });
  return getChainsQuery();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { segments } = await params;

  const result = chainNameSchema.safeParse(segments);

  if (!result.success) {
    notFound();
  }

  const { chains } = await getChainsForPage();
  const sourceChain = getChainByName(chains, result.data);
  const title = `Jumper | How To Swap on ${sourceChain?.name} | A Complete Guide`;

  const openGraph: Metadata['openGraph'] = {
    title: title,
    description: `Jumper offers the best way to swap tokens on ${sourceChain?.name} with the fastest speeds, lowest costs, and most secure swap providers available.`,
    siteName: siteName,
    url: `${getSiteUrl()}/swap/${slugify(segments)}`,
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

export async function generateStaticParams() {
  const { chains } = await getChainsForPage();

  return chains.map((chain) => ({
    segments: slugify(chain.name),
  }));
}

async function SwapPageLoader({ params }: { params: Params }) {
  const { segments } = await params;

  try {
    const result = chainNameSchema.safeParse(
      decodeURIComponent(slugify(segments)),
    );

    if (!result.success) {
      return notFound();
    }

    const { chains } = await getChainsForPage();
    const sourceChain = getChainByName(chains, result.data);

    if (!sourceChain) {
      return notFound();
    }

    return (
      <SwapPage
        sourceChain={sourceChain}
        destinationChain={sourceChain}
        chainName={result.data}
      />
    );
  } catch (e) {
    return notFound();
  }
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<WidgetPageSkeleton />}>
      <SwapPageLoader params={params} />
    </Suspense>
  );
}
