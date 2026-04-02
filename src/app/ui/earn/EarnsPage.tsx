import type { FC } from 'react';

import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnPageTracking } from '@/components/headless/tracking/EarnPageTracking';
import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = async () => {
  const initialAllOpportunities = await getOpportunitiesFiltered({})
    .then((response) => response.data)
    .catch(() => ({
      data: [],
      meta: {
        total: 0,
        updatedAt: new Date().toISOString(),
      },
    }));
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll initialAllOpportunities={initialAllOpportunities} />
      <EarnPageTracking />
    </>
  );
};
