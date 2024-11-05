import type { Metadata } from 'next';
import ProfilePage from '@/app/ui/profile/ProfilePage';
import { getSiteUrl } from '@/const/urls';

export const metadata: Metadata = {
  title: 'Jumper Profile',
  description: 'Jumper Profile is the profile page of Jumper Exchange.',
  alternates: {
    canonical: `${getSiteUrl()}/profile`,
  },
};

export default async function Page() {
  return <ProfilePage />;
}
