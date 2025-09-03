import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isEarnFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function EarnLayout({ children }: PropsWithChildren) {
  if (!isEarnFeatureEnabled()) {
    return notFound();
  }

  return (
    <Layout>
      <PageContainer>{children}</PageContainer>
    </Layout>
  );
}
