import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPerks } from 'src/app/lib/getPerks';
import { PerksPage } from 'src/components/PerksPage/PerksPage';
import { PerksPageSkeleton } from 'src/components/PerksPage/PerksPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';

// The perks hub paginates client-side, so fetch the full set up front.
const PERKS_PAGE_SIZE = 100;

export const metadata: Metadata = {
  title: 'Perks | Jumper',
  description:
    'Unlock and claim exclusive perks from Jumper partners as you level up your Jumper Pass.',
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Perks}`,
  },
};

export default async function Page() {
  const { data: perksResponse } = await getPerks({
    page: 1,
    pageSize: PERKS_PAGE_SIZE,
    withCount: true,
  });

  return (
    <Suspense fallback={<PerksPageSkeleton />}>
      <PerksPage perks={perksResponse.data} />
    </Suspense>
  );
}
