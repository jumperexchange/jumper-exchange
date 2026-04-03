import type { FC } from 'react';

import { EarnOpportunitiesAllClient } from './EarnOpportunitiesAll/EarnOpportunitiesAllClient';
import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';
import type { EarnOpportunities } from '@/types/jumper-backend';

export interface EarnsPageProps {
  initialAllOpportunities: EarnOpportunities;
}

export const EarnsPage: FC<EarnsPageProps> = ({ initialAllOpportunities }) => {
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAllClient
        initialAllOpportunities={initialAllOpportunities}
      />
      <EarnPageTracking />
    </>
  );
};
