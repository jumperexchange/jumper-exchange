'use client';

import EarnBetaIllustration from '@/components/illustrations/EarnBetaIllustration';
import { BlockedAccountCallout } from '@/jumperFlags/bouncer/BlockedAccountCallout';
import { Bouncer } from '@/jumperFlags/bouncer/Bouncer';
import { Gatekeeper } from '@/jumperFlags/gatekeeper/Gatekeeper';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isEarnFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export const fetchCache = 'default-cache';

export default function EarnLayout({ children }: PropsWithChildren) {
  if (!isEarnFeatureEnabled()) {
    return notFound();
  }

  return (
    <Layout>
      <FetchInterceptorProvider />
      <Bouncer loading allowed>
        <Gatekeeper
          flag="hasEarn"
          pageTitle="Jumper Earn"
          subtitleIntroKey="earn"
          illustrations={{
            illustration: <EarnBetaIllustration />,
            mobile: {
              sx: {
                maxWidth: 343,
                marginTop: 8,
              },
            },
            desktop: {
              sx: {
                maxWidth: 728,
                marginTop: 20,
              },
            },
          }}
        >
          <PageContainer>{children}</PageContainer>
        </Gatekeeper>
      </Bouncer>
      <Bouncer blocked>
        <PageContainer>
          <BlockedAccountCallout />
        </PageContainer>
      </Bouncer>
    </Layout>
  );
}
