import Stack from '@mui/material/Stack';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioChartContainer,
} from './PortfolioHeaderOverview.styles';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { LineChartSkeleton } from '@/components/core/charts/LineChart/LineChartSkeleton';

export const PortfolioHeaderOverviewSkeleton = () => {
  return (
    <PortfolioHeaderOverviewContainer>
      <PortfolioHeaderOverviewHeaderContainer>
        <BaseSurfaceSkeleton height={24} width={74} variant="rounded" />
        <BaseSurfaceSkeleton height={40} width={40} variant="circular" />
      </PortfolioHeaderOverviewHeaderContainer>
      <PortfolioHeaderOverviewContentContainer>
        <BaseSurfaceSkeleton height={32} width={154} variant="rounded" />
        <Stack sx={{ gap: 0, width: '100%' }}>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <BaseSurfaceSkeleton variant="text" width={64} height={20} />
          </Stack>
          <PortfolioChartContainer>
            <LineChartSkeleton />
          </PortfolioChartContainer>
        </Stack>
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
