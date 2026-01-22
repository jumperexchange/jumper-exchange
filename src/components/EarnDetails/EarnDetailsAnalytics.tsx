'use client';

import { useState } from 'react';
import {
  EarnDetailsAnalyticsButton,
  EarnDetailsAnalyticsButtonsContainer,
  EarnDetailsAnalyticsContainer,
  EarnDetailsAnalyticsHeaderContainer,
  EarnDetailsAnalyticsLineChartContainer,
} from './EarnDetails.styles';
import { EarnDetailsApyChart } from './EarnDetailsApyChart';
import { EarnDetailsTvlChart } from './EarnDetailsTvlChart';
import { AnalyticsRangeFieldEnum, AnalyticsValueFieldEnum } from './types';
import { capitalizeString } from 'src/utils/capitalizeString';

interface EarnDetailsAnalyticsProps {
  slug: string;
}

export const EarnDetailsAnalytics: React.FC<EarnDetailsAnalyticsProps> = ({
  slug,
}) => {
  const [value, setValue] = useState<AnalyticsValueFieldEnum>(
    AnalyticsValueFieldEnum.APY,
  );
  const [range, setRange] = useState<AnalyticsRangeFieldEnum>(
    AnalyticsRangeFieldEnum.WEEK,
  );

  const isApy = value === AnalyticsValueFieldEnum.APY;

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
        {isApy ? (
          <EarnDetailsApyChart slug={slug} range={range} />
        ) : (
          <EarnDetailsTvlChart slug={slug} range={range} />
        )}
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
};
