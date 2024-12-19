import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'berachain',
  },
};

export default async function BeraChainLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
