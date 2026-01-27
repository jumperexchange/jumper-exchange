import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getMerklRewards } from 'src/app/lib/getMerklRewards';
import { getPerks } from 'src/app/lib/getPerks';
import { ProfilePage } from 'src/components/ProfilePage/ProfilePage';
import { ProfilePageSkeleton } from 'src/components/ProfilePage/ProfilePageSkeleton';
import { PAGE_SIZE } from 'src/const/perks';

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
  const [{ data: perksResponse }, { data: merklRewardsResponse }] =
    await Promise.all([
      getPerks({
        page: 1,
        pageSize: PAGE_SIZE,
        withCount: true,
      }),
      getMerklRewards(),
    ]);

  const perks = perksResponse.data;
  const totalPerks = perksResponse.meta.pagination?.total || 0;
  const hasMorePerks = totalPerks > perks.length;

  const merklRewards = merklRewardsResponse.data;
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePage
        isPublic={true}
        perks={perks}
        hasMorePerks={hasMorePerks}
        merklRewards={merklRewards}
      />
    </Suspense>
  );
}
