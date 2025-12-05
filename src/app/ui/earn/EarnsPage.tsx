import type { FC } from 'react';

import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = () => {
  return (
    <>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll />
    </>
  );
};
