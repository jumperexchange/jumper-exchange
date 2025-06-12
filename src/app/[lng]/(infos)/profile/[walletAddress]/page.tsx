import ProfilePage from '@/app/ui/profile/ProfilePage';
import { getSiteUrl } from '@/const/urls';
import { walletAddressSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';

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
  const { data: campaigns } = await getProfileBannerCampaigns();
  const { data: questsData } = await getQuestsWithNoCampaignAttached();
  return (
    <ProfilePage
      quests={questsData.data}
      campaigns={campaigns}
      walletAddress={sanitizedAddress}
      isPublic
    />
  );
}
