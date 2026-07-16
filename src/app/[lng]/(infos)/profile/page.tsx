import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { cacheLife } from 'next/cache';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPerksForPage } from 'src/app/lib/getPerksForPage';
import { ProfilePage } from '@/components/ProfilePage/ProfilePage';

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
  'use cache';
  cacheLife({ revalidate: 300 });
  const perks = await getPerksForPage();

  return <ProfilePage isPublic={true} perks={perks} />;
}
