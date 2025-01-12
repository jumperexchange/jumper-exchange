import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { WalletProviderZap } from 'src/providers/WalletProvider/WalletProviderZap';

export const metadata: Metadata = {
  other: {
    'partner-theme': 'default',
  },
};

export default async function MainLayout({ children }: PropsWithChildren) {
  return (
    <WalletProviderZap>
      <Layout>{children}</Layout>
    </WalletProviderZap>
  );
}
