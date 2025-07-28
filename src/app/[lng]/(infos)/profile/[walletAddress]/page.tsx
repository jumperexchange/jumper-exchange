import { getSiteUrl } from '@/const/urls';
import { walletAddressSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
import { getPerks } from 'src/app/lib/getPerks';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import OldProfilePage from 'src/app/ui/profile/OldProfilePage';
import { ProfilePage } from 'src/components/ProfilePage/ProfilePage';
import { ProfilePageSkeleton } from 'src/components/ProfilePage/ProfilePageSkeleton';
import { GlobalFeatureFlags } from 'src/const/abtests';
import { fetchQuestOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';

type Params = Promise<{ walletAddress: string }>;

const baseUrl = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    const { walletAddress } = await params;

    // Validate wallet address
    const result = walletAddressSchema.safeParse(walletAddress);
    if (!result.success) {
      throw new Error('Invalid wallet address');
    }

    const sanitizedAddress = result.data;

    return {
      openGraph: {
        title: `Profile of ${sanitizedAddress}`,
        description: `Profile of ${sanitizedAddress}`,
        type: 'profile',
        url: `${baseUrl}/profile/${sanitizedAddress}`,
        images: `${baseUrl}/api/profile/${sanitizedAddress}`,
      },
      twitter: {
        images: `${baseUrl}/api/profile/${sanitizedAddress}`,
      },
    };
  } catch (err) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
      alternates: {
        canonical: `${baseUrl}/profile`,
      },
    };
  }
}

export const dynamic = 'force-static';

export default async function Page({ params }: { params: Params }) {
  const { walletAddress } = await params;

  // Validate wallet address
  const result = walletAddressSchema.safeParse(walletAddress);
  if (!result.success) {
    return notFound();
  }

  const sanitizedAddress = result.data;
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

  const questsExtended = await fetchQuestOpportunitiesByRewardsIds(
    questsData.data,
  );

  if (isPageEnabled) {
    const perks = perksResponse.data;
    const totalPerks = perksResponse.meta.pagination?.total || 0;
    const hasMorePerks = totalPerks > perks.length;

    return (
      <Suspense fallback={<ProfilePageSkeleton />}>
        <ProfilePage perks={perks} hasMorePerks={hasMorePerks} />
      </Suspense>
    );
  }

  return (
    <OldProfilePage
      quests={questsExtended}
      campaigns={campaigns}
      walletAddress={sanitizedAddress}
    />
  );
}
