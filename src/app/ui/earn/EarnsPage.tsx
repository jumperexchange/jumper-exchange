import type { FC } from 'react';
import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';
import { LoopoorMarketBanner } from './LoopoorMarketBanner';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = () => {
  return (
    <>
      <EarnTopOpportunities />
      <LoopoorMarketBanner />
      <EarnOpportunitiesAll />
      <EarnPageTracking />
    </>
  );
};
