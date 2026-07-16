import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPerks } from '@/app/lib/getPerks';
import { ProfilePage } from '@/components/ProfilePage/ProfilePage';
import { ProfilePageSkeleton } from '@/components/ProfilePage/ProfilePageSkeleton';

export const metadata: Metadata = {
  title: pageMetadataFields.profile.title,
  description: pageMetadataFields.profile.description,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Profile}`,
  },
  openGraph: {
    ...pageOpenGraph.profile,
    url: `${getSiteUrl()}${AppPaths.Profile}`,
  },
  twitter: {
    ...pageTwitter.profile,
  },
};

export default async function Page() {
  const perks = await getAllPerks();

  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePage isPublic={true} perks={perks} />
    </Suspense>
  );
}
