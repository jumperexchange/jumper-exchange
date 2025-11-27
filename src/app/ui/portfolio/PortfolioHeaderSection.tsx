import Grid from '@mui/material/Grid';
import { PortfolioHeaderBreakdown } from './PortfolioHeaderBreakdown';
import { PortfolioHeaderOverview } from './PortfolioHeaderOverview';

export const PortfolioHeaderSection = () => {
  return (
    <Grid container spacing={4}>
      <Grid
        size={{
          xs: 12,
          md: 7,
        }}
      >
        <PortfolioHeaderOverview />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 5,
        }}
      >
        <PortfolioHeaderBreakdown />
      </Grid>
    </Grid>
  );
};
