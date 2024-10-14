import { type Metadata } from 'next';
import Superfest from 'src/app/ui/superfest/Superfest';

export const metadata: Metadata = {
  title: 'Jumper | Superfest',
  description: 'Dive into the Superchain DeFi Festival!',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/superfest`,
  },
};

export default async function Page() {
  return <Superfest />;
}
