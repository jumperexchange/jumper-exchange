'use client';
import { LineChartSkeleton } from '../core/charts/LineChart/LineChartSkeleton';
import {
  EarnDetailsAnalyticsContainer,
  EarnDetailsAnalyticsHeaderContainer,
  EarnDetailsAnalyticsButtonsContainer,
  EarnDetailsAnalyticsLineChartContainer,
  BaseSkeletonBox,
} from './EarnDetails.styles';

export const EarnDetailsAnalyticsSkeleton = () => {
  return (
    <EarnDetailsAnalyticsContainer>
      <EarnDetailsAnalyticsHeaderContainer direction="row">
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Array.from({ length: 4 }).map((_, index) => (
            <BaseSkeletonBox
              key={index}
              variant="rounded"
              width={56}
              height={32}
            />
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
        <EarnDetailsAnalyticsButtonsContainer direction="row">
          {Array.from({ length: 2 }).map((_, index) => (
            <BaseSkeletonBox
              key={index}
              variant="rounded"
              width={56}
              height={32}
            />
          ))}
        </EarnDetailsAnalyticsButtonsContainer>
      </EarnDetailsAnalyticsHeaderContainer>
      <EarnDetailsAnalyticsLineChartContainer>
        <LineChartSkeleton />
      </EarnDetailsAnalyticsLineChartContainer>
    </EarnDetailsAnalyticsContainer>
  );
};
