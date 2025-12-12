import { EarnsPage, EarnsPageSkeleton } from '@/app/ui/earn';
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

export default async function Page() {
  console.log('1. Earn page');

  return (
    <Suspense fallback={<EarnsPageSkeleton />}>
      <EarnsPage />
    </Suspense>
  );
}
