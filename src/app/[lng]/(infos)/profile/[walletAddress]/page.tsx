import ProfilePage from '@/app/ui/profile/ProfilePage';
import type { Metadata } from 'next';
import { getSiteUrl } from '@/const/urls';

type Props = {
  params: { walletAddress: string };
};

const baseUrl = getSiteUrl();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    openGraph: {
      title: `Profile of ${params.walletAddress}`,
      description: `Profile of ${params.walletAddress}`,
      type: 'profile',
      url: `${baseUrl}/profile/${params.walletAddress}`,
      images: `${baseUrl}/api/profile/${params.walletAddress}`,
    },
    twitter: {
      images: `${baseUrl}/api/profile/${params.walletAddress}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: { walletAddress: string };
}) {
  return <ProfilePage walletAddress={params.walletAddress} isPublic />;
}
