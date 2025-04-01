import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Jumper Campaign - ${slug}`, // Example: Dynamic title
    other: {
      'partner-theme': slug,
    },
  };
}

export default async function CampaignLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>;
}
