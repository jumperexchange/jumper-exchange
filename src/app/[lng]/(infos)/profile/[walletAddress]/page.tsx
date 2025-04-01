import ProfilePage from '@/app/ui/profile/ProfilePage';
import type { Metadata } from 'next';
import { getSiteUrl } from '@/const/urls';

type Params = Promise<{ walletAddress: string }>;

const baseUrl = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { walletAddress } = await params;

  return {
    openGraph: {
      title: `Profile of ${walletAddress}`,
      description: `Profile of ${walletAddress}`,
      type: 'profile',
      url: `${baseUrl}/profile/${walletAddress}`,
      images: `${baseUrl}/api/profile/${walletAddress}`,
    },
    twitter: {
      images: `${baseUrl}/api/profile/${walletAddress}`,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { walletAddress } = await params;

  return <ProfilePage walletAddress={walletAddress} isPublic />;
}
