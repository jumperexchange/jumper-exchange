import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from '../../../Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'wash',
  },
};
export default async function WastLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      <div id={'wash-root'}>{children}</div>
    </Layout>
  );
}
