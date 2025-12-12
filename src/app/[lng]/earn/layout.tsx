'use client';

import { Gatekeeper } from '@/app/ui/gatekeeper/Gatekeeper';
import EarnBetaIllustration from '@/components/illustrations/EarnBetaIllustration';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isEarnFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { PageContainer } from 'src/components/Containers/PageContainer';
import { Layout } from 'src/Layout';
import { FetchInterceptorProvider } from 'src/providers/FetchInterceptorProvider';

export const fetchCache = 'default-cache';

export default function EarnLayout({ children }: PropsWithChildren) {
  console.log('1. EarnLayout');

  if (!isEarnFeatureEnabled()) {
    console.log('2. EarnLayout not found');
    return notFound();
  }

  console.log('3. EarnLayout found');
  return (
    <Layout>
      <FetchInterceptorProvider />
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
    </Layout>
  );
}
