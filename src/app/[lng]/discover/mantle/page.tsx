import { type Metadata } from 'next';
import Quests from 'src/app/ui/quests/Quests';

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
  return <Quests />;
}
