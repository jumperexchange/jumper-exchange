import { notFound } from 'next/navigation';
import { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from 'src/app/lib/getOpportunityRelatedMarket';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { AppPaths } from 'src/const/urls';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { EarnDetailsIntro } from 'src/components/EarnDetails/EarnDetailsIntro';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = async ({ slug }) => {
  // TODO: LF-14853: Opportunity Details
  const opportunity = await getOpportunityBySlug(slug);
  if (opportunity.error || !opportunity.data) {
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
        <GoBack path={AppPaths.Earn} dataTestId="earn-back-button" />

        <EarnDetailsIntro data={opportunity.data} isLoading={false} />
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
