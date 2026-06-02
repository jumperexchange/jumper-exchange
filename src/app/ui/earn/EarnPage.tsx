'use client';

import type { FC } from 'react';
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
import { EarnPageSkeleton } from './EarnPageSkeleton';
import {
  earnOpportunityBySlugQueryKey,
  fetchEarnOpportunityBySlug,
} from 'src/hooks/earn/useEarnOpportunityBySlug';
import {
  earnRelatedMarketsQueryKey,
  fetchEarnRelatedMarkets,
} from 'src/hooks/earn/useEarnRelatedMarkets';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS } from '@/const/time';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = ({ slug }) => {
  // TODO: LF-14853: Opportunity Details
  const { data: opportunity, isLoading: isOpportunityLoading } = useQuery({
    queryKey: earnOpportunityBySlugQueryKey(slug),
    queryFn: () => fetchEarnOpportunityBySlug(slug),
    staleTime: FIVE_MINUTES_MS,
  });

  const { data: relatedMarkets } = useQuery({
    queryKey: earnRelatedMarketsQueryKey(slug),
    queryFn: () => fetchEarnRelatedMarkets(slug),
    staleTime: FIVE_MINUTES_MS,
  });

  if (isOpportunityLoading || !opportunity) {
    return <EarnPageSkeleton />;
  }

  const { tags, protocol } = opportunity;

  return (
    <>
      <EarnDetailsSection>
        <GoBack path={AppPaths.Earn} dataTestId="earn-back-button" />
        <EarnDetailsIntro data={opportunity} isLoading={false} />
        <EarnDetailsAnalytics slug={slug} />
        <EarnDetailsRisks protocol={protocol} tags={tags} />
      </EarnDetailsSection>
      <EarnDetailsSection>
        <EarnRelatedMarkets relatedMarkets={relatedMarkets ?? []} />
      </EarnDetailsSection>
      <DepositFlowModal />
      <WithdrawFlowModal />
      <RequestRedeemFlowModal />
      <ContactSupportEventProvider />
      <EarnPageTracking slug={slug} />
    </>
  );
};
