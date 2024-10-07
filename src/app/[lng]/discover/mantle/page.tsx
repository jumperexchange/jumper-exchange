import { type Metadata } from 'next';
import MantlePage from 'src/app/ui/discover/mantle/MantlePage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper | Mantle',
    description: 'Dive into the Mantle Ecosystem!',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/discover/mantle/`,
    },
  };
}

export default async function Page() {
  return <MantlePage />;
}
