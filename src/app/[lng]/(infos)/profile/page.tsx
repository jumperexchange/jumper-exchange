import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
import { getPerks } from 'src/app/lib/getPerks';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import OldProfilePage from 'src/app/ui/profile/OldProfilePage';
import { ProfilePage } from 'src/components/ProfilePage/ProfilePage';
import { ProfilePageSkeleton } from 'src/components/ProfilePage/ProfilePageSkeleton';
import { GlobalFeatureFlags } from 'src/const/abtests';
import { fetchQuestOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';

export const metadata: Metadata = {
  title: 'Jumper Loyalty Pass',
  description:
    'Jumper Loyalty Pass is the page explaining the Loyalty Pass system.',
  alternates: {
    canonical: `${getSiteUrl()}/profile`,
  },
};

export default async function Page() {
  const [
    { data: campaigns },
    { data: questsData },
    { data: perksResponse },
    isPageEnabled,
  ] = await Promise.all([
    getProfileBannerCampaigns(),
    getQuestsWithNoCampaignAttached(),
    getPerks(),
    getFeatureFlag(GlobalFeatureFlags.ProfilePage),
  ]);

  // Fetch max APY for all quests and add to quest data
  const questsExtended = await fetchQuestOpportunitiesByRewardsIds(
    questsData.data,
  );

  if (isPageEnabled) {
    const perks = perksResponse.data;
    const totalPerks = perksResponse.meta.pagination?.total || 0;
    const hasMorePerks = totalPerks > perks.length;
    return (
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePage
          isPublic={true}
          perks={perks}
          hasMorePerks={hasMorePerks}
        />
      </Suspense>
    );
  }

  return (
    <OldProfilePage
      isPublic={false}
      quests={questsExtended}
      campaigns={campaigns}
    />
  );
}
