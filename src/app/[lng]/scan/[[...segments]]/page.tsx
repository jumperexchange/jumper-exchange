import { siteName } from '@/app/lib/metadata';
import ScanPage from '@/app/ui/scan/ScanPage';
import { getSiteUrl } from '@/const/urls';
import { scanParamsSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: {
    segments: string[];
  };
}): Promise<Metadata> {
  try {
    // Validate segments
    const result = scanParamsSchema.safeParse({ segments: params.segments });
    if (!result.success) {
      throw new Error('Invalid scan segments');
    }

    const slugToTitle: { [key: string]: string } = {
      tx: 'Transaction',
      block: 'Block',
      wallet: 'wallet',
    };

    const [slug, address] = result.data.segments || [];

    const title = `Jumper Scan | ${slug && address ? `${slugToTitle[slug]} ${address}` : 'Blockchain Explorer'}`;
    const description =
      'Jumper Scan is a blockchain explorer that allows you to search and explore transactions, blocks, and wallets on multiple blockchains.';
    const canonical = `${getSiteUrl()}/scan${params.segments.length === 0 ? '' : `/${params.segments.join('/')}`}`;

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
  } catch (err) {
    return {
      title: 'Jumper Scan | Blockchain Explorer',
      description:
        'Jumper Scan is a blockchain explorer that allows you to search and explore transactions, blocks, and wallets on multiple blockchains.',
      alternates: {
        canonical: `${getSiteUrl()}/scan`,
      },
    };
  }
}

export default function Page({
  params,
}: {
  children: React.ReactNode;
  params: { lng: string; segments: string[] };
}) {
  // Validate segments
  const result = scanParamsSchema.safeParse({ segments: params.segments });
  if (!result.success) {
    return notFound();
  }

  return <ScanPage lng={params.lng} />;
}
