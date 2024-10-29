import { getCookies } from '@/app/lib/getCookies';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import App from '../../ui/app/App';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

const FeatureCards = dynamic(() =>
  import('@/components/FeatureCards/FeatureCards').then((s) => s.FeatureCards),
);

export default async function MainLayout({ children }: PropsWithChildren) {
  const { activeTheme } = getCookies();
  return (
    <>
      <Layout>
        <App activeTheme={activeTheme}>{children}</App>
      </Layout>
      <FeatureCards />
    </>
  );
}
