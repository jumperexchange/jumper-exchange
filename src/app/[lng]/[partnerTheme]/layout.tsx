import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { FeatureCardsWrapper } from '@/components/FeatureCards';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { Layout } from 'src/Layout';

export async function generateMetadata({
  params: { partnerTheme },
}: {
  params: { partnerTheme: string };
}): Promise<Metadata> {
  const partnerThemes = await getPartnerThemes();
  const partnerThemesData = partnerThemes.data?.find(
    (d) => d.attributes?.uid === partnerTheme,
  );
  const theme = partnerThemesData
    ? partnerThemesData.attributes?.uid
    : 'default';
  return {
    other: {
      'partner-theme': theme,
    },
  };
}

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  const partnerThemes = await getPartnerThemes();

  const partnerThemesData = partnerThemes.data?.find(
    (d) => d.attributes?.uid === partnerTheme,
  );

  if (!partnerThemesData) {
    return notFound();
  }

  return (
    <>
      <Layout disableNavbar={true}>{children}</Layout>
      <FeatureCardsWrapper />
    </>
  );
}
