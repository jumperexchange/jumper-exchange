import { FC } from 'react';

import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnOpportunitiesAllServer } from './EarnOpportunitiesAll/EarnOpportunitiesAllServer';
import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';

interface EarnsPageProps {
  initialFilters?: EarnOpportunityFilter;
}

export const EarnsPage: FC<EarnsPageProps> = ({ initialFilters }) => {
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAllServer initialFilters={initialFilters} />
    </>
  );
};
