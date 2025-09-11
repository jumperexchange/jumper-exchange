import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MainLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      <FetchInterceptorProvider />
      <PageContainer>{children}</PageContainer>
    </Layout>
  );
}
