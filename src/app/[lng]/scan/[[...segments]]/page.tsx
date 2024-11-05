import ScanPage from '@/app/ui/scan/ScanPage';
import type { Metadata } from 'next';
import { siteName } from '@/app/lib/metadata';
import { getSiteUrl } from '@/const/urls';

export async function generateMetadata({
  params: { segments = [] },
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

  const [slug, address] = segments;

  const title = `Jumper Scan | ${slug && address ? `${slugToTitle[slug]} ${address}` : 'Blockchain Explorer'}`;
  const description =
    'Jumper Scan is a blockchain explorer that allows you to search and explore transactions, blocks, and wallets on multiple blockchains.';
  const canonical = `${getSiteUrl()}/scan${segments.length === 0 ? '' : `/${segments.join('/')}`}`;

  return {
    robots: {
      index: false,
    },
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      siteName,
      url: canonical,
    },
    twitter: {
      title,
      description,
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
