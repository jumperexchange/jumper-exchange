import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from 'src/app/lib/getOpportunityRelatedMarket';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { EarnDetailsIntro } from 'src/components/EarnDetails/EarnDetailsIntro';
import { EarnDetailsRisks } from 'src/components/EarnDetails/EarnDetailsRisks/EarnDetailsRisks';
import { AppPaths } from 'src/const/urls';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { EarnRelatedMarkets } from 'src/components/EarnRelatedMarkets/EarnRelatedMarkets';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { ContactSupportEventProvider } from '@/components/Widgets/events/ContactSupportEventProvider';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';
import { RequestRedeemFlowModal } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = async ({ slug }) => {
  console.log('27. EarnPage');

  // TODO: LF-14853: Opportunity Details
  const [opportunity, relatedMarkets] = await Promise.all([
    getOpportunityBySlug(slug).catch((error) => {
      return { error, data: undefined };
    }),
    getOpportunityRelatedMarket(slug).catch((error) => {
      return { error, data: [] };
    }),
  ]);

  console.log('28. EarnPage opportunity', opportunity);

  if (opportunity.error || !opportunity.data) {
    return notFound();
  }

  if (relatedMarkets.error) {
    console.error(relatedMarkets.error);
    // pass
  }

  const relatedMarketsData =
    relatedMarkets.data?.filter(Boolean).slice(0, 3) ?? [];

  console.log('29. EarnPage relatedMarkets', relatedMarketsData);

  const { tags, protocol } = opportunity.data;

  return (
    <>
      <EarnDetailsSection>
        <GoBack path={AppPaths.Earn} dataTestId="earn-back-button" />
        <EarnDetailsIntro data={opportunity.data} isLoading={false} />
        <EarnDetailsAnalytics slug={slug} />
        <EarnDetailsRisks protocol={protocol} tags={tags} />
      </EarnDetailsSection>
      <EarnDetailsSection>
        <EarnRelatedMarkets relatedMarkets={relatedMarketsData} />
      </EarnDetailsSection>
      <DepositFlowModal />
      <WithdrawFlowModal />
      <RequestRedeemFlowModal />
      <ContactSupportEventProvider />
      <EarnPageTracking slug={slug} />
    </>
  );
};
