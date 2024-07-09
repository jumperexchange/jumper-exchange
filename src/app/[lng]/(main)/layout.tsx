import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';

export default async function MainLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <>
      {children}
      <FeatureCards />
    </>
  );
}
