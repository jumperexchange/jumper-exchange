import type { Metadata } from 'next';

import PolicyPage from 'src/app/ui/policy/PolicyPage';

export const metadata: Metadata = {
  title: 'Jumper | Privacy Policy',
  description: 'The page to check the privacy policy on Jumper',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/policy`,
  },
};

export default async function Page() {
  return <PolicyPage />;
}
