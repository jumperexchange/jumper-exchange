import { notFound } from 'next/navigation';
import { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from 'src/app/lib/getOpportunityRelatedMarket';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = async ({ slug }) => {
  // TODO: LF-14853: Opportunity Details
  const { data, error } = await getOpportunityBySlug(slug);
  if (error || !data) {
    return notFound();
  }

  const relatedMarkets = await getOpportunityRelatedMarket(slug);
  if (relatedMarkets.error) {
    console.error(relatedMarkets.error);
    // pass
  }

  const related = relatedMarkets.data.slice(0, 3) ?? [];

  return (
    <>
      <EarnDetailsSection>
        <h1>EarnPage</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <h2>Analytics</h2>
        <EarnDetailsAnalytics slug={slug} />
      </EarnDetailsSection>
      <EarnDetailsSection>
        <h2>Related Markets</h2>
        <pre>
          {JSON.stringify(
            related.map((x) => x.slug),
            null,
            2,
          )}
        </pre>
      </EarnDetailsSection>
    </>
  );
};
