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

const INSTANT_APY_ALLOWED_RANGES: AnalyticsRangeFieldEnum[] = [
  AnalyticsRangeFieldEnum.WEEK,
];

const VALUE_LABELS: Record<AnalyticsValueFieldEnum, string> = {
  [AnalyticsValueFieldEnum.APY]: 'APY',
  [AnalyticsValueFieldEnum.INSTANT_APY]: 'Instant APY',
  [AnalyticsValueFieldEnum.TVL]: 'TVL',
};

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

  const isInstantApy = value === AnalyticsValueFieldEnum.INSTANT_APY;
  const isApy = value === AnalyticsValueFieldEnum.APY || isInstantApy;

  const handleValueChange = (newValue: AnalyticsValueFieldEnum) => {
    setValue(newValue);
    if (newValue === AnalyticsValueFieldEnum.INSTANT_APY) {
      if (!INSTANT_APY_ALLOWED_RANGES.includes(range)) {
        setRange(AnalyticsRangeFieldEnum.WEEK);
      }
    }
  };

  const isRangeDisabled = (rangeItem: AnalyticsRangeFieldEnum) =>
    isInstantApy && !INSTANT_APY_ALLOWED_RANGES.includes(rangeItem);

  return (
    <EarnDetailsAnalyticsContainer>
      <EarnDetailsAnalyticsHeaderContainer direction="row">
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Object.values(AnalyticsRangeFieldEnum).map((rangeItem) => (
            <EarnDetailsAnalyticsButton
              key={rangeItem}
              isActive={rangeItem === range}
              isDisabled={isRangeDisabled(rangeItem)}
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
              onClick={() => handleValueChange(valueItem)}
              size="small"
              data-testid={`analytics-value-${valueItem}`}
            >
              {VALUE_LABELS[valueItem]}
            </EarnDetailsAnalyticsButton>
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
      </EarnDetailsAnalyticsHeaderContainer>
      <EarnDetailsAnalyticsLineChartContainer>
        {isApy ? (
          <EarnDetailsApyChart
            slug={slug}
            range={range}
            instant={isInstantApy}
          />
        ) : (
          <EarnDetailsTvlChart slug={slug} range={range} />
        )}
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
};
