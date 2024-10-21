import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {};

export default async function SuperfestLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      <div id={'wash-root'}>{children}</div>
    </Layout>
  );
}
