import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { FeatureCards } from '@/components/FeatureCards';
import { partnerThemeSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { Layout as BaseLayout } from 'src/Layout';

export async function generateMetadata({
  params: { partnerTheme },
}: {
  params: { partnerTheme: string };
}): Promise<Metadata> {
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
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  // Validate partner theme format
  const result = partnerThemeSchema.safeParse(partnerTheme);
  if (!result.success) {
    return notFound();
  }

  // Check if partner theme exists in Strapi
  const partnerThemes = await getPartnerThemes();
  const partnerThemesData = partnerThemes.data?.find(
    (d) => d?.uid === partnerTheme,
  );

  if (!partnerThemesData) {
    return notFound();
  }

  return (
    <>
      <BaseLayout disableNavbar={true}>{children}</BaseLayout>
      <FeatureCards />
    </>
  );
}
