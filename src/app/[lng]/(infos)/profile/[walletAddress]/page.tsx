import ProfilePage from '@/app/ui/profile/ProfilePage';

export default async function Page({
  params,
}: {
  params: { walletAddress: string };
}) {
  return <ProfilePage walletAddress={params.walletAddress} isPublic />;
}
