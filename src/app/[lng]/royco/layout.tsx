import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { RoycoProvider } from 'src/integrations/royco/sdk';

export default async function RoycoLayout({ children }: PropsWithChildren) {
  return (
    <RoycoProvider originUrl="#" originKey="#">
      <Layout>{children}</Layout>
    </RoycoProvider>
  );
}
