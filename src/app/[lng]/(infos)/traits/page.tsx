import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import TraitsPage from 'src/app/ui/traits/TraitsPage';

export const metadata: Metadata = {
  title: 'Jumper Traits',
  description: 'Jumper Traits is showing the users´ traits on Jumper.',
  alternates: {
    canonical: `${getSiteUrl()}/traits`,
  },
};

export default async function Page() {
  return <TraitsPage />;
}
