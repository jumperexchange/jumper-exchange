import type { Metadata } from 'next';

import PolicyPage from 'src/app/ui/policy/PolicyPage';
import { getSiteUrl } from '@/const/urls';

export const metadata: Metadata = {
  title: 'Jumper | Privacy Policy',
  description: 'The page to check the privacy policy on Jumper',
  alternates: {
    canonical: `${getSiteUrl()}/policy`,
  },
};

export default async function Page() {
  return <PolicyPage />;
}
