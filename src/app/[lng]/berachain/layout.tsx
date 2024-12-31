import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { RoycoClientProvider } from '@/app/[lng]/berachain/RoycoClientProvider';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'berachain',
  },
};

export default async function BeraChainLayout({ children }: PropsWithChildren) {
  return (
    <RoycoClientProvider>
      <Layout>{children}</Layout>
    </RoycoClientProvider>
  );
}
