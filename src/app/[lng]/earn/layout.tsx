import { Gatekeeper } from '@/app/ui/gatekeeper/Gatekeeper';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isEarnFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default function EarnLayout({ children }: PropsWithChildren) {
  if (!isEarnFeatureEnabled()) {
    return notFound();
  }

  return (
    <Layout>
      <FetchInterceptorProvider />
      <Gatekeeper
        flag="hasEarn"
        pageTitle="Jumper Earn"
        illustrations={{
          mobile: {
            src: '/earn-gatekeeper-hero-mobile.png',
            sx: {
              maxWidth: '343px',
            },
          },
          desktop: {
            src: '/earn-gatekeeper-hero-desktop.png',
            sx: {
              maxWidth: '728px',
            },
          },
        }}
      >
        <PageContainer>{children}</PageContainer>
      </Gatekeeper>
    </Layout>
  );
}
