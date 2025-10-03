import { FC } from 'react';

import { EarnOpportunitiesAll } from './EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = async () => {
  return (
    <div>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll />
    </div>
  );
};
