import { Metadata } from 'next';
import { Suspense } from 'react';
import { MissionsPage } from 'src/app/ui/missions/MissionsPage';
import { MissionsPageSkeleton } from 'src/app/ui/missions/MissionsPageSkeleton';
import { getSiteUrl, AppPaths } from 'src/const/urls';

export const metadata: Metadata = {
  title: 'Jumper Missions',
  description: `Discover, interact, and grow in DeFi with Jumper's missions and ecosystem campaigns.`,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Missions}`,
  },
};

export default async function Page() {
  return (
    <Suspense fallback={<MissionsPageSkeleton />}>
      <MissionsPage />
    </Suspense>
  );
}
