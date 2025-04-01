import { getCookies } from '@/app/lib/getCookies';
import { FeatureCards } from '@/components/FeatureCards';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import App from '../../ui/app/App';

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MainLayout({ children }: PropsWithChildren) {
  const { activeTheme } = await getCookies();
  return (
    <>
      <Layout>
        <App activeTheme={activeTheme}>{children}</App>
      </Layout>
      <FeatureCards />
    </>
  );
}
