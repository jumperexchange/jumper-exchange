'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  AnalyticsRangeField,
  AnalyticsValueField,
  EarnOpportunityAnalyticsQuery,
} from 'src/app/lib/getOpportunityAnalytics';
import { useEarnAnalytics } from 'src/hooks/earn/useEarnAnalytics';

type Props = {
  slug: string;
};

const useAnalyticsQuery = (slug: string) => {
  const [query, setQuery] = useState<EarnOpportunityAnalyticsQuery>({
    value: 'apy',
    range: 'day',
  });

  const result = useEarnAnalytics({ slug, query });

  const setValue = useCallback(
    (value: AnalyticsValueField) => {
      setQuery((query) => ({ ...query, value }));
    },
    [setQuery],
  );

  const setRange = useCallback(
    (range: AnalyticsRangeField) => {
      setQuery((query) => ({ ...query, range }));
    },
    [setQuery],
  );

  return useMemo(
    () => ({
      ...result,
      value: query.value,
      range: query.range,
      setValue,
      setRange,
    }),
    [result, query, setValue, setRange],
  );
};

export const EarnDetailsAnalytics: React.FC<Props> = ({ slug }) => {
  const { isLoading, error, data, value, range, setValue, setRange } =
    useAnalyticsQuery(slug);

  return (
    <div>
      <h2>Analytics</h2>
      <div>
        <button onClick={() => setValue('apy')} disabled={value === 'apy'}>
          APY
        </button>
        <button onClick={() => setValue('tvl')} disabled={value === 'tvl'}>
          TVL
        </button>
      </div>
      <div>
        <button onClick={() => setRange('day')} disabled={range === 'day'}>
          Day
        </button>
        <button onClick={() => setRange('week')} disabled={range === 'week'}>
          Week
        </button>
        <button onClick={() => setRange('month')} disabled={range === 'month'}>
          Month
        </button>
        <button onClick={() => setRange('year')} disabled={range === 'year'}>
          Year
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      {error ? <div>Error: {`${error}`}</div> : null}
      {data && (
        <div>
          {data.points.length} points
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
