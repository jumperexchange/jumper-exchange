import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
import { MissionsPage } from 'src/app/ui/missions/MissionsPage';
import { MissionsPageSkeleton } from 'src/app/ui/missions/MissionsPageSkeleton';

export default async function Page() {
  const isPageEnabled = await getFeatureFlag('missions_page');

  //   if (!isPageEnabled) {
  //     return notFound();
  //   }

  return (
    <Suspense fallback={<MissionsPageSkeleton />}>
      <MissionsPage />
    </Suspense>
  );
}
