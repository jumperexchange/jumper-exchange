import { EarnPage, EarnPageSkeleton } from '@/app/ui/earn';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { Suspense } from 'react';

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  // TODO: LF-14853: list available opportunities
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // TODO: LF-14987: Implement Metadata
  return {
    title: 'Jumper Earn',
    description: 'Jumper Earn',
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  return (
    <Suspense fallback={<EarnPageSkeleton />}>
      <EarnPage slug={slug} />
    </Suspense>
  );
}
