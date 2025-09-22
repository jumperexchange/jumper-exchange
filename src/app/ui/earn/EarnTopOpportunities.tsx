'use client';
import { Grid } from '@mui/material';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import {
  ithCopy,
  TopEarnCard,
} from 'src/components/Cards/EarnCard/variants/TopEarnCard';
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
            <TopEarnCard isLoading={true} data={null} />
          ) : (
            <TopEarnCard
              isLoading={isLoading}
              data={item}
              copy={ithCopy(index)}
              isMain={index === 0}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
};
