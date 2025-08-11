import { FC } from 'react';

import { EarnOpportunitiesSearch } from './EarnOpportunitiesSearch';
import { EarnTopOpportunities } from './EarnTopOpportunities';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = async () => {
  return (
    <div>
      <h1>EarnsPage</h1>

      <EarnTopOpportunities />
      <EarnOpportunitiesSearch />
    </div>
  );
};
