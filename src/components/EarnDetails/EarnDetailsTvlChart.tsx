'use client';

import { useEarnAnalytics } from 'src/hooks/earn/useEarnAnalytics';
import { TVL_FORMAT_CONFIG } from 'src/utils/numbers/tvl';
import { LineChart } from '../core/charts/LineChart/LineChart';
import { useSimpleAnalyticsChartConfig } from './hooks';
import type { AnalyticsRangeFieldEnum } from './types';

interface EarnDetailsTvlChartProps {
  slug: string;
  range: AnalyticsRangeFieldEnum;
}

export const EarnDetailsTvlChart: React.FC<EarnDetailsTvlChartProps> = ({
  slug,
  range,
}) => {
  const { isLoading, data } = useEarnAnalytics({
    slug,
    query: { value: 'tvl', range },
  });

  const config = useSimpleAnalyticsChartConfig(data, range);

  return (
    <LineChart
      isLoading={isLoading}
      dataSetId="tvl"
      data-testid="analytics-chart"
      valueFormatConfig={TVL_FORMAT_CONFIG}
      {...config}
    />
  );
};
