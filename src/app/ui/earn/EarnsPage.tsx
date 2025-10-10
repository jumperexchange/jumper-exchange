import { FC } from 'react';

import { EarnTopOpportunities } from './EarnTopOpportunities';
import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = () => {
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll />
    </>
  );
};
