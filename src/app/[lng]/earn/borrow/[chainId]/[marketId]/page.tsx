import { BorrowMarketPage } from '@/app/ui/earn/BorrowMarketPage';
import { EarnPageSkeleton } from '@/app/ui/earn';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type Params = Promise<{ chainId: string; marketId: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  return [];
}

export default async function Page({ params }: { params: Params }) {
  const { chainId, marketId } = await params;

  console.log('25. BorrowMarketPage page', { chainId, marketId });

  if (!chainId || !marketId) {
    return notFound();
  }

  const parsedChainId = Number(chainId);
  if (isNaN(parsedChainId)) {
    return notFound();
  }

  return (
    <Suspense fallback={<EarnPageSkeleton />}>
      <BorrowMarketPage chainId={parsedChainId} marketId={marketId} />
    </Suspense>
  );
}
