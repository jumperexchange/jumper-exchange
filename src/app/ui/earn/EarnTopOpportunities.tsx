'use client';

import { useEarnTopOpportunities } from 'src/hooks/earn/useEarnTopOpportunities';

interface EarnTopOpportunities {}

export const EarnTopOpportunities = () => {
  const address = '0xE131E0a520F312f0419c772a9889D0c0073db422';
  const { data, isLoading, error, isError } = useEarnTopOpportunities({
    address,
  });
  // TODO: LF-14983: Create earn page and root components
  // TODO: LF-14985: Pixel Perfect Design
  // TODO: LF-14990: Complex Top Opportunity rendering

  return (
    <div>
      <h1>EarnTopOpportunities</h1>
      <pre>{isLoading ? 'Loading...' : 'Loaded'}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{isError ? 'Error' : 'No error'}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
