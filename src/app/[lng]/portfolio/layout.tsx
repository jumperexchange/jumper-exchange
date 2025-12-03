import { Gatekeeper } from '@/app/ui/gatekeeper/Gatekeeper';
import { PortfolioPageOverlayLayout } from '@/app/ui/portfolio/PortfolioPageOverlayLayout';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isPortfolioFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default function PortfolioLayout({ children }: PropsWithChildren) {
  if (!isPortfolioFeatureEnabled()) {
    return notFound();
  }

  return (
    <Layout>
      <FetchInterceptorProvider />
      <Gatekeeper
        flag="hasEarn"
        pageTitle="Jumper Portfolio"
        illustrations={{
          mobile: {
            src: '/portfolio-gatekeeper-hero-mobile.png',
            sx: {
              maxWidth: '343px',
            },
          },
          desktop: {
            src: '/portfolio-gatekeeper-hero-desktop.png',
            sx: {
              maxWidth: '1080px',
            },
          },
        }}
      >
        <PortfolioPageOverlayLayout>
          <PageContainer>{children}</PageContainer>
        </PortfolioPageOverlayLayout>
      </Gatekeeper>
    </Layout>
  );
}
