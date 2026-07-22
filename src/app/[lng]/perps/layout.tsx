'use client';

import '@lifinance/perps-widget/style.css';

import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isPerpsFeatureEnabled } from 'src/app/lib/getFeatureFlag';
import { Layout } from 'src/Layout';

export default function PerpsLayout({ children }: PropsWithChildren) {
  if (!isPerpsFeatureEnabled()) {
    return notFound();
  }

  return <Layout>{children}</Layout>;
}
