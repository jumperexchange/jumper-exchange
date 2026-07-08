'use client';

import type { FC } from 'react';
import { DepositFlowModal } from 'src/components/composite/DepositFlow/DepositFlow';
import { GoBack } from 'src/components/composite/GoBack/GoBack';
import { EarnDetailsAnalytics } from 'src/components/EarnDetails/EarnDetailsAnalytics';
import { EarnDetailsIntro } from 'src/components/EarnDetails/EarnDetailsIntro';
import { EarnDetailsMessages } from '@/components/EarnDetails/EarnDetailsMessages/EarnDetailsMessages';
import { EarnDetailsRisks } from 'src/components/EarnDetails/EarnDetailsRisks/EarnDetailsRisks';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { EarnRelatedMarkets } from 'src/components/EarnRelatedMarkets/EarnRelatedMarkets';
import { AppPaths } from 'src/const/urls';
import { useEarnOpportunityBySlug } from 'src/hooks/earn/useEarnOpportunityBySlug';
import { useEarnRelatedMarkets } from 'src/hooks/earn/useEarnRelatedMarkets';
import { RequestRedeemFlowModal } from '@/components/composite/RequestRedeemFlow/RequestRedeemFlow';
import { WithdrawFlowModal } from '@/components/composite/WithdrawFlow/WithdrawFlow';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';
import { ContactSupportEventProvider } from '@/components/Widgets/events/ContactSupportEventProvider';
import { EarnPageSkeleton } from './EarnPageSkeleton';

interface EarnPageProps {
  slug: string;
}

export const EarnPage: FC<EarnPageProps> = ({ slug }) => {
  const { data: opportunity, isPending: isOpportunityPending } =
    useEarnOpportunityBySlug(slug);
  const { data: relatedMarkets } = useEarnRelatedMarkets(slug);

  if (isOpportunityPending || !opportunity) {
    return <EarnPageSkeleton />;
  }

  const { tags, protocol, messages } = opportunity;

  return (
    <>
      <EarnDetailsSection>
        <GoBack path={AppPaths.Earn} dataTestId="earn-back-button" />
        <EarnDetailsIntro data={opportunity} isLoading={false} />
        <EarnDetailsMessages messages={messages} />
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
