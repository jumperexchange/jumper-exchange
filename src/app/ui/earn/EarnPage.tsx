'use client';

import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { getOpportunityBySlug } from 'src/app/lib/getOpportunityBySlug';
import { getOpportunityRelatedMarket } from 'src/app/lib/getOpportunityRelatedMarket';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsIntro } from 'src/components/EarnDetails/EarnDetailsIntro';
import { EarnDetailsRisks } from 'src/components/EarnDetails/EarnDetailsRisks/EarnDetailsRisks';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { EarnRelatedMarkets } from 'src/components/EarnRelatedMarkets/EarnRelatedMarkets';
import { AppPaths } from 'src/const/urls';
import { earnOpportunityBySlugQueryKey } from 'src/hooks/earn/useEarnOpportunityBySlug';
import { earnRelatedMarketsQueryKey } from 'src/hooks/earn/useEarnRelatedMarkets';
import { RequestRedeemFlowModal } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';
import { ContactSupportEventProvider } from '@/components/Widgets/events/ContactSupportEventProvider';
import { FIVE_MINUTES_MS } from '@/const/time';
import { EarnPageSkeleton } from './EarnPageSkeleton';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = ({ slug }) => {
  const { data: opportunity, isLoading: isOpportunityLoading } = useQuery({
    queryKey: earnOpportunityBySlugQueryKey(slug),
    queryFn: async () => {
      const result = await getOpportunityBySlug(slug);
      return result.data;
    },
    staleTime: FIVE_MINUTES_MS,
  });

  const { data: relatedMarkets } = useQuery({
    queryKey: earnRelatedMarketsQueryKey(slug),
    queryFn: async () => {
      const result = await getOpportunityRelatedMarket(slug);
      return result.data;
    },
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
        <EarnRelatedMarkets
          relatedMarkets={relatedMarkets?.filter(Boolean).slice(0, 3) ?? []}
        />
      </EarnDetailsSection>
      <DepositFlowModal />
      <WithdrawFlowModal />
      <RequestRedeemFlowModal />
      <ContactSupportEventProvider />
      <EarnPageTracking slug={slug} />
    </>
  );
};
