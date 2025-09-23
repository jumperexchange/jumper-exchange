'use client';

import { Grid } from '@mui/material';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import { useEarnTopOpportunities } from 'src/hooks/earn/useEarnTopOpportunities';

interface EarnTopOpportunities {}

export const EarnTopOpportunities = () => {
  const { data, isLoading, error, isError } = useEarnTopOpportunities({});
  // TODO: LF-14985: Pixel Perfect Design
  const items = AtLeastNWhenLoading(data, isLoading, 2);

  return (
    <Grid container spacing={2}>
      {items?.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: index === 0 ? 7 : 5 }}>
          {item == null ? (
            <EarnCard variant="top" isLoading={true} data={null} />
          ) : (
            <EarnCard variant="top" isLoading={isLoading} data={item} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
