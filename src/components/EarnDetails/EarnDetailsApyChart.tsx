'use client';

import { useEarnApyAnalytics } from 'src/hooks/earn/useEarnApyAnalytics';
import { StackedAreaChart } from '../core/charts/StackedAreaChart';
import { useApyAnalyticsChartConfig } from './hooks';
import type { AnalyticsRangeFieldEnum } from './types';

interface EarnDetailsApyChartProps {
  slug: string;
  range: AnalyticsRangeFieldEnum;
}

export const EarnDetailsApyChart: React.FC<EarnDetailsApyChartProps> = ({
  slug,
  range,
}) => {
  const { isLoading, data: rawData } = useEarnApyAnalytics({ slug, range });
  const config = useApyAnalyticsChartConfig(rawData, range);

  return (
    <StackedAreaChart
      isLoading={isLoading}
      data-testid="analytics-chart"
      {...config}
    />
  );
};
