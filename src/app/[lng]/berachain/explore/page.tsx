import { type Metadata } from 'next';
import BerachainExploreMarketPage from 'src/app/ui/berachain/BerachainExploreMarketPage';

export const metadata: Metadata = {
  title: 'Jumper | Berachain',
  description: 'Dive into the Berachain universe!',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/berachain`,
  },
};

export default async function Page() {
  return <BerachainExploreMarketPage />;
}
