'use client';

import type { FC } from 'react';

import { Gatekeeper } from '../gatekeeper/Gatekeeper';
import { EarnOpportunitiesAll } from './EarnOpportunitiesAll/EarnOpportunitiesAll';
import { EarnTopOpportunities } from './EarnTopOpportunities';

interface EarnsPageProps {}

export const EarnsPage: FC<EarnsPageProps> = () => {
  return (
    <Gatekeeper>
      <EarnTopOpportunities />
      <EarnOpportunitiesAll />
    </Gatekeeper>
  );
};
