import type { FC } from 'react';

import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = () => {
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll />
      <EarnPageTracking />
    </>
  );
};
