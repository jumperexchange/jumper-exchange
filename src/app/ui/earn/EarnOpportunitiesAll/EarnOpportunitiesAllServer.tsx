import { FC, Suspense } from 'react';
import { EarnOpportunitiesAllClient } from './EarnOpportunitiesAllClient';
import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';
import { EarnOpportunitiesAllSkeleton } from './EarnOpportunitiesAllSkeleton';

interface EarnOpportunitiesAllServerProps {
  initialFilters: EarnOpportunityFilter;
}

export const EarnOpportunitiesAllServer: FC<
  EarnOpportunitiesAllServerProps
> = async ({ initialFilters }) => {
  return (
    <Suspense fallback={<EarnOpportunitiesAllSkeleton />}>
      <EarnOpportunitiesAllClient initialFilters={initialFilters} />
    </Suspense>
  );
};
