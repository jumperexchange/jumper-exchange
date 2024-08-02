import Superfest from 'src/app/ui/superfest/Superfest';
import { type Metadata } from 'next';
import Landing from 'src/app/ui/discover/landing';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper | Superfest',
    description: 'Dive into the Superchain DeFi Festival!',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/superfest/`,
    },
  };
}

export default async function Page() {
  return <Landing />;
}
