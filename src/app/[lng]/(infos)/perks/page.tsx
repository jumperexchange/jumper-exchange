import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPerks } from '@/app/lib/getPerks';
import { PerksPage } from '@/components/PerksPage/PerksPage';
import { PerksPageSkeleton } from '@/components/PerksPage/PerksPageSkeleton';
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
  const perks = await getAllPerks();

  return (
    <Suspense fallback={<PerksPageSkeleton />}>
      <PerksPage perks={perks} />
    </Suspense>
  );
}
