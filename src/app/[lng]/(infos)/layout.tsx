import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export default async function InfosLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
