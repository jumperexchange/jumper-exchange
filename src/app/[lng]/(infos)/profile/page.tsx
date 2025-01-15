import type { Metadata } from 'next';
import ProfilePage from '@/app/ui/profile/ProfilePage';
import { getSiteUrl } from '@/const/urls';

export const metadata: Metadata = {
  title: 'Jumper Loyalty Pass',
  description:
    'Jumper Loyalty Pass is the page explaining the Loyalty Pass sytem.',
  alternates: {
    canonical: `${getSiteUrl()}/profile`,
  },
};

export default async function Page() {
  return <ProfilePage />;
}
