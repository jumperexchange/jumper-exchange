'use client';

import { useState } from 'react';
import {
  EarnDetailsAnalyticsContainer,
  EarnDetailsAnalyticsHeaderContainer,
  EarnDetailsAnalyticsButtonsContainer,
  EarnDetailsAnalyticsButton,
  EarnDetailsAnalyticsLineChartContainer,
} from './EarnDetails.styles';
import {
  AnalyticsRangeFieldEnum,
  BorrowAnalyticsValueFieldEnum,
} from './types';
import { capitalizeString } from '@/utils/capitalizeString';
import { useLoopoorMarketHistory } from 'src/hooks/loopoor/useLoopoorMarketHistory';
import { useBorrowAnalyticsChartConfig } from './hooks';
import { LineChart } from '../core/charts/LineChart/LineChart';
import { APY_FORMAT_CONFIG } from '@/utils/numbers/apy';
import type { ValueFormatConfig } from 'src/utils/formatNumbers';

interface BorrowDetailsChartProps {
  chainId: number;
  marketId: string;
}

const VALUE_LABELS: Record<BorrowAnalyticsValueFieldEnum, string> = {
  [BorrowAnalyticsValueFieldEnum.BORROW_APY]: 'Borrow APY',
  [BorrowAnalyticsValueFieldEnum.SUPPLY_APY]: 'Supply APY',
  [BorrowAnalyticsValueFieldEnum.UTILIZATION]: 'Utilization',
};

const VALUE_FORMAT: Record<BorrowAnalyticsValueFieldEnum, ValueFormatConfig> = {
  [BorrowAnalyticsValueFieldEnum.BORROW_APY]: APY_FORMAT_CONFIG,
  [BorrowAnalyticsValueFieldEnum.SUPPLY_APY]: APY_FORMAT_CONFIG,
  [BorrowAnalyticsValueFieldEnum.UTILIZATION]: APY_FORMAT_CONFIG,
};

export function BorrowDetailsChart({
  chainId,
  marketId,
}: BorrowDetailsChartProps) {
  const [range, setRange] = useState<AnalyticsRangeFieldEnum>(
    AnalyticsRangeFieldEnum.WEEK,
  );
  const [valueField, setValueField] = useState<BorrowAnalyticsValueFieldEnum>(
    BorrowAnalyticsValueFieldEnum.BORROW_APY,
  );

  const { isLoading, data } = useLoopoorMarketHistory({ chainId, marketId });
  const config = useBorrowAnalyticsChartConfig(data, range, valueField);

  return (
    <EarnDetailsAnalyticsContainer>
      <EarnDetailsAnalyticsHeaderContainer direction="row">
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Object.values(AnalyticsRangeFieldEnum).map((rangeItem) => (
            <EarnDetailsAnalyticsButton
              key={rangeItem}
              isActive={rangeItem === range}
              onClick={() => setRange(rangeItem)}
              size="small"
            >
              {capitalizeString(rangeItem)}
            </EarnDetailsAnalyticsButton>
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Object.values(BorrowAnalyticsValueFieldEnum).map((v) => (
            <EarnDetailsAnalyticsButton
              key={v}
              isActive={v === valueField}
              onClick={() => setValueField(v)}
              size="small"
            >
              {VALUE_LABELS[v]}
            </EarnDetailsAnalyticsButton>
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
      </EarnDetailsAnalyticsHeaderContainer>
      <EarnDetailsAnalyticsLineChartContainer>
        <LineChart
          isLoading={isLoading}
          dataSetId={valueField}
          data-testid="borrow-analytics-chart"
          valueFormatConfig={VALUE_FORMAT[valueField]}
          {...config}
        />
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
}
