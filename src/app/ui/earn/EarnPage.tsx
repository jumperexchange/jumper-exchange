import { notFound } from 'next/navigation';
import { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from 'src/app/lib/getOpportunityRelatedMarket';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { AppPaths } from 'src/const/urls';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { EarnDetailsIntro } from 'src/components/EarnDetails/EarnDetailsIntro';
import { EarnRelatedMarkets } from 'src/components/EarnRelatedMarkets/EarnRelatedMarkets';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = async ({ slug }) => {
  // TODO: LF-14853: Opportunity Details
  const [opportunity, relatedMarkets] = await Promise.all([
    getOpportunityBySlug(slug),
    getOpportunityRelatedMarket(slug),
  ]);

  if (opportunity.error || !opportunity.data) {
    return notFound();
  }

  if (relatedMarkets.error) {
    console.error(relatedMarkets.error);
    // pass
  }

  const relatedMarketsData =
    relatedMarkets.data.filter(Boolean).slice(0, 3) ?? [];

  return (
    <>
      <EarnDetailsSection>
        <GoBack path={AppPaths.Earn} dataTestId="earn-back-button" />
        <EarnDetailsIntro data={opportunity.data} isLoading={false} />
        <EarnDetailsAnalytics slug={slug} />
      </EarnDetailsSection>
      <EarnDetailsSection>
        <EarnRelatedMarkets relatedMarkets={relatedMarketsData} />
      </EarnDetailsSection>
      <DepositFlowModal />
    </>
  );
};
