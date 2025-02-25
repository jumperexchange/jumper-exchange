import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `Jumper Campaign - ${params.slug}`, // Example: Dynamic title
    other: {
      'partner-theme': params.slug,
    },
  };
}

export default async function CampaignLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
