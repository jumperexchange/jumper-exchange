import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
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
  const [{ data: campaigns }, { data: questsData }, isPageEnabled] =
    await Promise.all([
      getProfileBannerCampaigns(),
      getQuestsWithNoCampaignAttached(),
      getFeatureFlag(GlobalFeatureFlags.ProfilePage),
    ]);

  // Fetch max APY for all quests and add to quest data
  const questsExtended = await fetchQuestOpportunitiesByRewardsIds(
    questsData.data,
  );

  if (isPageEnabled) {
    return (
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePage
          isPublic={true}
          campaigns={campaigns}
          quests={questsExtended}
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
