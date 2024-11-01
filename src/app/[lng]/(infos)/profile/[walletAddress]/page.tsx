import ProfilePage from '@/app/ui/profile/ProfilePage';
import type { Metadata } from 'next';

type Props = {
  params: { walletAddress: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    openGraph: {
      title: `Profile of ${params.walletAddress}`,
      description: `Profile of ${params.walletAddress}`,
      type: 'profile',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${params.walletAddress}`,
      images: `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/${params.walletAddress}`,
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
