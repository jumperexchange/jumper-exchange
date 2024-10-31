import type { Metadata } from 'next';
import ProfilePage from '@/app/ui/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'Jumper Profile',
  description: 'Jumper Profile is the profile page of Jumper Exchange.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,
  },
};

export default async function Page() {
  return <ProfilePage />;
}
