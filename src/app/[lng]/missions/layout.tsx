import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MissionsLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      <PageContainer>{children}</PageContainer>
    </Layout>
  );
}
