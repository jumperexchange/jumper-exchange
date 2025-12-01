import { EarnsPage, EarnsPageSkeleton } from '@/app/ui/earn';
import { searchParamsLoader } from '@/app/ui/earn/utils';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Jumper Earn Opportunities',
  description: `Discover, interact, and grow in DeFi with Jumper's earning opportunities.`,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Earn}`,
  },
};

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const parsedSearchParams = await searchParamsLoader(props.searchParams);
  return (
    <Suspense fallback={<EarnsPageSkeleton />}>
      <EarnsPage searchParams={parsedSearchParams} />
    </Suspense>
  );
}
