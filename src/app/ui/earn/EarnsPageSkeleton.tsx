'use client';

import Grid from '@mui/material/Grid';
import { HeroEarnCardSkeleton } from 'src/components/Cards/HeroEarnCard/HeroEarnCardSkeleton';
import { EarnOpportunitiesAllSkeleton } from './EarnOpportunitiesAll/EarnOpportunitiesAllSkeleton';

export const EarnsPageSkeleton = () => {
  return (
    <>
      <Grid container spacing={2}>
        {Array.from({ length: 2 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: index === 0 ? 7 : 5 }}>
            <HeroEarnCardSkeleton />
          </Grid>
        ))}
      </Grid>
      <EarnOpportunitiesAllSkeleton />
    </>
  );
};
