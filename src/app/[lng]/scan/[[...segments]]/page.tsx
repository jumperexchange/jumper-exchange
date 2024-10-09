import ScanPage from '@/app/ui/scan/ScanPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { segments },
}: {
  params: {
    segments: string[];
  };
}): Promise<Metadata> {
  const slugToTitle: { [key: string]: string } = {
    tx: 'Transaction',
    block: 'Block',
    wallet: 'wallet',
  };

  let title = 'Jumper Scan | Crosschain Transactions Explorer';
  let canonical = `${process.env.NEXT_PUBLIC_SITE_URL}/scan`;
  if (segments && segments.length > 0) {
    const [slug, address] = segments;
    title = `Jumper Scan | ${slugToTitle[slug]} ${address}`;
    canonical = `${process.env.NEXT_PUBLIC_SITE_URL}/scan/${segments.join('/')}`;
  }

  return {
    title: title,
    description:
      'Jumper Scan is a blockchain explorer that allows you to search and explore transactions, blocks, and wallets on multiple blockchains.',
    alternates: {
      canonical: canonical,
    },
  };
}

export default function Page({
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return <ScanPage lng={lng} />;
}
