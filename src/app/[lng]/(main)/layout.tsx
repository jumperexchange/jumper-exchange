import { FeatureCards } from '@/components/FeatureCards';
import React from 'react';

export default async function MainLayout({
  children,
  params: { lng, partnerTheme },
}: {
  children: React.ReactNode;
  params: { lng: string; partnerTheme?: string };
}) {
  return (
    <>
      {children}
      <FeatureCards />
    </>
  );
}
