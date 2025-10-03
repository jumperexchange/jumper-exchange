'use client';

import { useMemo } from 'react';
import {
  EarnDetailsAnalyticsButton,
  EarnDetailsAnalyticsButtonsContainer,
  EarnDetailsAnalyticsContainer,
  EarnDetailsAnalyticsHeaderContainer,
  EarnDetailsAnalyticsLineChartContainer,
} from './EarnDetails.styles';
import { LineChart } from '../core/charts/LineChart/LineChart';
import { useAnalyticsChartData, useAnalyticsQuery } from './hooks';
import { AnalyticsRangeFieldEnum, AnalyticsValueFieldEnum } from './types';
import { capitalizeString } from 'src/utils/capitalizeString';

interface EarnDetailsAnalyticsProps {
  slug: string;
}

export const EarnDetailsAnalytics: React.FC<EarnDetailsAnalyticsProps> = ({
  slug,
}) => {
  const { isLoading, error, data, value, range, setValue, setRange } =
    useAnalyticsQuery(slug);

  const {
    data: chartData,
    theme: chartTheme,
    dateFormat: chartDateFormat,
  } = useAnalyticsChartData(data, range);

  const transformedData = useMemo(() => {
    return (
      data?.points.map((point) => ({
        date: new Date(point.t).toISOString(),
        value: point.v,
      })) ?? []
    );
  }, [data]);

  return (
    <EarnDetailsAnalyticsContainer>
      <EarnDetailsAnalyticsHeaderContainer direction="row">
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Object.values(AnalyticsRangeFieldEnum).map((rangeItem) => (
            <EarnDetailsAnalyticsButton
              key={rangeItem}
              isActive={rangeItem === range}
              onClick={() => setRange(rangeItem as AnalyticsRangeFieldEnum)}
              size="small"
            >
              {capitalizeString(rangeItem)}
            </EarnDetailsAnalyticsButton>
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Object.values(AnalyticsValueFieldEnum).map((valueItem) => (
            <EarnDetailsAnalyticsButton
              key={valueItem}
              isActive={valueItem === value}
              onClick={() => setValue(valueItem as AnalyticsValueFieldEnum)}
              size="small"
            >
              {valueItem.toUpperCase()}
            </EarnDetailsAnalyticsButton>
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
      </EarnDetailsAnalyticsHeaderContainer>
      <EarnDetailsAnalyticsLineChartContainer>
        <LineChart
          isLoading={isLoading}
          data={chartData}
          dateFormat={chartDateFormat}
          theme={chartTheme}
        />
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
};
