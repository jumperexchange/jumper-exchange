import {
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '@/app/lib/metadata';
import { getEarnInitialAllOpportunitiesCached } from '@/app/lib/getEarnInitialAllOpportunitiesCached';
import { EarnsPage } from '@/app/ui/earn/EarnsPage';
import { AppPaths, getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: pageMetadataFields.earn.title,
  description: pageMetadataFields.earn.description,
  alternates: {
    canonical: `${getSiteUrl()}${AppPaths.Earn}`,
  },
  openGraph: {
    ...pageOpenGraph.earn,
    url: `${getSiteUrl()}${AppPaths.Earn}`,
  },
  twitter: {
    ...pageTwitter.earn,
  },
};

export default async function Page() {
  const initialAllOpportunities = await getEarnInitialAllOpportunitiesCached();

  return <EarnsPage initialAllOpportunities={initialAllOpportunities} />;
}
