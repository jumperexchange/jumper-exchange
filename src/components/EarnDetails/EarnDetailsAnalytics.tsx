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
              data-testid={`analytics-range-${rangeItem}`}
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
              data-testid={`analytics-value-${valueItem}`}
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
          dataSetId={value}
          dataSetValueAppend={value === AnalyticsValueFieldEnum.APY ? '%' : ''}
          theme={chartTheme}
          data-testid="analytics-chart"
        />
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
};
