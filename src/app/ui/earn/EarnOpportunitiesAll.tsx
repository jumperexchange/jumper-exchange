'use client';

import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';
import { useEarnFilterOpportunities } from 'src/hooks/earn/useEarnFilterOpportunities';

export const EarnOpportunitiesAll = () => {
  const filter: EarnOpportunityFilter = {
    chainId: 42,
  };
  const { data, isLoading, error, isError } = useEarnFilterOpportunities({
    filter,
  });

  return (
    <div>
      <h1>EarnOpportunitiesSearch</h1>
      <pre>{isLoading ? 'Loading...' : 'Loaded'}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{isError ? 'Error' : 'No error'}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
