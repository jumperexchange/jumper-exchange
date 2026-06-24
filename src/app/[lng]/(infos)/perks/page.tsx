import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPerks } from 'src/app/lib/getPerks';
import { PerksPage } from 'src/components/PerksPage/PerksPage';
import { PerksPageSkeleton } from 'src/components/PerksPage/PerksPageSkeleton';
import { AppPaths, getSiteUrl } from '@/const/urls';

export const metadata: Metadata = {
  title: 'Perks | Jumper',
  description:
    'Unlock and claim exclusive perks from Jumper partners as you level up your Jumper Pass.',
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Perks}`,
  },
};

export default async function Page() {
  // Fetch the total count first, then request every perk in a single follow-up
  // call so the hub never silently caps as more perks are added.
  const { data: countResponse } = await getPerks({
    page: 1,
    pageSize: 1,
    withCount: true,
  });
  const total = countResponse.meta.pagination.total;

  const { data: perksResponse } = await getPerks({
    page: 1,
    pageSize: Math.max(total, 1),
  });

  return (
    <Suspense fallback={<PerksPageSkeleton />}>
      <PerksPage perks={perksResponse.data} />
    </Suspense>
  );
}
