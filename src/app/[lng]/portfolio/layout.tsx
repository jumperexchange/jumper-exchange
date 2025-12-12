import { Gatekeeper } from '@/app/ui/gatekeeper/Gatekeeper';
import { PortfolioPageOverlayLayout } from '@/app/ui/portfolio/PortfolioPageOverlayLayout';
import PortfolioBetaIllustration from '@/components/illustrations/PortfolioBetaIllustration';
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
        subtitleIntroKey="portfolio"
        illustrations={{
          illustration: <PortfolioBetaIllustration />,
          mobile: {
            sx: {
              marginTop: 8,
            },
          },
          desktop: {
            sx: {
              maxWidth: 1080,
              marginTop: 15,
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
