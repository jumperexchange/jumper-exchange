import type { Metadata } from 'next';
import ProfilePage from '../../../ui/profile/ProfilePage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper Profile',
    description: 'Jumper Profile is the profile page of Jumper Exchange.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/profile`,
    },
  };
}

export default async function Page() {
  return <ProfilePage />;
}
