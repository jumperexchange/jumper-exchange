import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { FeatureCards } from '@/components/FeatureCards';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { Layout } from 'src/Layout';

type Params = Promise<{ partnerTheme: string }>;
export const fetchCache = 'default-cache';

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { partnerTheme } = await params;

  const partnerThemes = await getPartnerThemes();
  const partnerThemesData = partnerThemes.data?.find(
    (d) => d?.uid === partnerTheme,
  );
  const theme = partnerThemesData ? partnerThemesData?.uid : 'default';
  return {
    other: {
      'partner-theme': theme,
    },
  };
}

export default async function PartnerThemeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { partnerTheme } = await params;
  const partnerThemes = await getPartnerThemes();

  const partnerThemesData = partnerThemes.data?.find(
    (d) => d?.uid === partnerTheme,
  );

  if (!partnerThemesData) {
    return notFound();
  }

  return (
    <>
      <Layout disableNavbar={true}>{children}</Layout>
      <FeatureCards />
    </>
  );
}
