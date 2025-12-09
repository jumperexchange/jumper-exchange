import Grid from '@mui/material/Grid';
import { PortfolioHeaderOverviewSkeleton } from './PortfolioHeaderOverviewSkeleton';
import { PortfolioHeaderBreakdownSkeleton } from './PortfolioHeaderBreakdownSkeleton';

export const PortfolioHeaderSectionSkeleton = () => {
  return (
    <Grid container spacing={4}>
      <Grid
        size={{
          xs: 12,
          md: 7,
        }}
      >
        <PortfolioHeaderOverviewSkeleton />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <PortfolioHeaderBreakdownSkeleton />
      </Grid>
    </Grid>
  );
};
