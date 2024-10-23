import type { Metadata } from 'next';
import VerifyPage from 'src/app/ui/verify/VerifyPage';

export const metadata: Metadata = {
  title: 'Verify',
  description: 'Verify your wallet on Jumper Exchange.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
  },
};

export default async function Page() {
  return <VerifyPage />;
}
