import { FeatureCards } from '@/components/FeatureCards';
import React from 'react';
import { Layout as BaseLayout } from 'src/Layout';

export const fetchCache = 'default-cache';

export default async function LidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BaseLayout disableNavbar={true}>{children}</BaseLayout>
      <FeatureCards />
    </>
  );
}
