import { type Metadata } from 'next';
import BerachainExplorePage from 'src/app/ui/berachain/BerachainExplorePage';

export const metadata: Metadata = {
  title: 'Jumper | Berachain',
  description: 'Dive into the Berachain universe!',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/berachain`,
  },
};

export default async function Page() {
  return <BerachainExplorePage />;
}
