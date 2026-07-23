import type { Metadata } from 'next';
import { PnlShareRedirect } from '@/components/SocialCard/PnlShareRedirect';
import { getSiteUrl } from '@/const/urls';
import {
  buildPnlShareImageUrl,
  buildPnlShareLandingUrl,
  buildPnlShareLink,
  formatAmountWon,
} from '@/utils/image-generation/pnlShareCard';
import { pnlShareSchema } from '@/utils/image-generation/pnlShareSchema';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const baseUrl = getSiteUrl();

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parseCard = (params: Record<string, string | string[] | undefined>) => {
  const result = pnlShareSchema.safeParse({
    amountWon: firstValue(params.amountWon),
    swapSize: firstValue(params.swapSize),
    fromToken: firstValue(params.fromToken),
    toToken: firstValue(params.toToken),
    referralCode: firstValue(params.referralCode),
  });

  return result.success ? result.data : null;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const card = parseCard(await searchParams);

  if (!card) {
    return {
      title: 'Jumper',
      alternates: { canonical: baseUrl },
    };
  }

  const imageUrl = buildPnlShareImageUrl(card, baseUrl);
  const landingUrl = buildPnlShareLandingUrl(card, baseUrl);
  const title = `${formatAmountWon(card.amountWon)} extra output on my ${card.fromToken} → ${card.toToken} swap`;
  const description = `See how much more you can get on your swaps with Jumper.`;
  const image = { url: imageUrl, width: 1080, height: 1080, alt: title };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: landingUrl,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Jumper',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const card = parseCard(await searchParams);
  const target = buildPnlShareLink(card?.referralCode);

  return <PnlShareRedirect target={target} />;
}
