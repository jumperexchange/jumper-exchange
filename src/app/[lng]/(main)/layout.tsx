import { getCookies } from '@/app/lib/getCookies';
import { FeatureCards } from '@/components/FeatureCards';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import App from '../../ui/app/App';

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      'partner-theme': 'default',
    },
  };
}

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
