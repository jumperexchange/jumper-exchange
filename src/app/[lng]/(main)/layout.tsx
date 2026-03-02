import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import App from '../../ui/app/App';
import { ClientOnly } from '@/components/ClientOnly';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Layout>
        <ClientOnly>
          <App>{children}</App>
        </ClientOnly>
      </Layout>
      <FeatureCards />
    </>
  );
}
