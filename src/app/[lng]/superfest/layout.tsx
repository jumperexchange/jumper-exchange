import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      'partner-theme': 'op',
    },
  };
}

export default async function SuperfestLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
