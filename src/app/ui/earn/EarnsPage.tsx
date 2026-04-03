import type { FC } from 'react';
import { Suspense } from 'react';

import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnOpportunitiesAllSkeleton } from './EarnOpportunitiesAll/EarnOpportunitiesAllSkeleton';
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
      <Suspense fallback={<EarnOpportunitiesAllSkeleton />}>
        <EarnOpportunitiesAll
          initialAllOpportunities={initialAllOpportunities}
        />
      </Suspense>
      <EarnPageTracking />
    </>
  );
};
