import { type Metadata } from 'next';
import RoycoPage from 'src/app/ui/royco/RoycoPage';

export const metadata: Metadata = {
  title: 'Jumper | Royco',
  description: 'Royco on Jumper Exchange',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/royco`,
  },
};

export default async function Page() {
  return <RoycoPage />;
}
