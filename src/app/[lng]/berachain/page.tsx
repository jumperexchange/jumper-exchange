import { type Metadata } from 'next';
import BerachainPage from 'src/app/ui/berachain/BerachainPage';

export const metadata: Metadata = {
  title: 'Jumper | Berachain',
  description: 'Dive into the Berachain universe!',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/berachain`,
  },
};

export default async function Page() {
  return <BerachainPage />;
}
