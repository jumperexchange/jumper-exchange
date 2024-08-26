import { type Metadata } from 'next';
import Quest from 'src/app/ui/quests/Quests';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper | Superfest',
    description: 'Dive into the Quests',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/quests/`,
    },
  };
}

export default async function Page() {
  return <Quest />;
}
