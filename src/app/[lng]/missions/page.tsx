import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
import { MissionsPage } from 'src/app/ui/missions/MissionsPage';
import { MissionsPageSkeleton } from 'src/app/ui/missions/MissionsPageSkeleton';
import { GlobalFeatureFlags } from 'src/const/abtests';
import { getSiteUrl, AppPaths } from 'src/const/urls';

export const metadata: Metadata = {
  title: 'Jumper Missions',
  description: 'Jumper Missions is the reward area of Jumper Exchange.',
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Missions}`,
  },
};

export default async function Page() {
  const isPageEnabled = await getFeatureFlag(GlobalFeatureFlags.MissionsPage);

  if (!isPageEnabled) {
    return notFound();
  }

  return (
    <Suspense fallback={<MissionsPageSkeleton />}>
      <MissionsPage />
    </Suspense>
  );
}
