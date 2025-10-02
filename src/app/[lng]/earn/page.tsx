import { EarnsPage, EarnsPageSkeleton } from '@/app/ui/earn';
import { AppPaths, getSiteUrl } from '@/const/urls';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { EarnsPageSearchParams } from 'src/app/ui/earn/types';
import { parseFiltersFromUrl } from 'src/app/ui/earn/utils';

export const metadata: Metadata = {
  title: 'Jumper Earn Opportunities',
  description: `Discover, interact, and grow in DeFi with Jumper's earning opportunities.`,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Earn}`,
  },
};

interface PageProps {
  searchParams: Promise<EarnsPageSearchParams>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const initialFilters = parseFiltersFromUrl(searchParams);
  return (
    <Suspense fallback={<EarnsPageSkeleton />}>
      <EarnsPage initialFilters={initialFilters} />
    </Suspense>
  );
}
