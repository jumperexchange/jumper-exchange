import Superfest from 'src/app/ui/superfest/Superfest';
import { type Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper - Superfest',
    description: 'Page where you can join the Superfest.',
  };
}

export default async function Page() {
  return <Superfest />;
}
