'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  EarnDetailsAnalyticsContainer,
  EarnDetailsAnalyticsHeaderContainer,
  EarnDetailsAnalyticsButtonsContainer,
  EarnDetailsAnalyticsButton,
  EarnDetailsAnalyticsLineChartContainer,
} from './EarnDetails.styles';
import { useState } from 'react';
import { AnalyticsRangeFieldEnum } from './types';
import { capitalizeString } from '@/utils/capitalizeString';

export function BorrowDetailsChart() {
  const [range, setRange] = useState<AnalyticsRangeFieldEnum>(
    AnalyticsRangeFieldEnum.WEEK,
  );

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
      </EarnDetailsAnalyticsHeaderContainer>
      <EarnDetailsAnalyticsLineChartContainer>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="bodySmall" color="text.secondary">
            Chart coming soon
          </Typography>
        </Box>
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
}
