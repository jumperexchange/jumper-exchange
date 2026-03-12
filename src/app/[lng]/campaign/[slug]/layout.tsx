import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export default async function CampaignLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
