import { getCookies } from '@/app/lib/getCookies';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Layout>{children}</Layout>
    </>
  );
}
