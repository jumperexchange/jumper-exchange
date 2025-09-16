'use client';

import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { useEarnTopOpportunities } from 'src/hooks/earn/useEarnTopOpportunities';

interface EarnTopOpportunities {}

export const EarnTopOpportunities = () => {
  const { data, isLoading, error, isError } = useEarnTopOpportunities({});
  // TODO: LF-14985: Pixel Perfect Design
  // TODO: LF-14990: Complex Top Opportunity rendering

  return (
    <div>
      {/* {data?.map((opportunity, index) => (
        <EarnCard
          {...opportunity}
          key={index}
          variant="top"
          isLoading={isLoading}
          // TODO: where is this coming from?
          assets={{
            label: opportunity.name,
            tooltip: opportunity.description,
            tokens: [opportunity.asset],
          }}
        />
      ))} */}
      <pre>{isLoading ? 'Loading...' : 'Loaded'}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{isError ? 'Error' : 'No error'}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
