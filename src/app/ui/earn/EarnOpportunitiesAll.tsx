'use client';
import { Card, CardContent, Grid } from '@mui/material';
import { useState } from 'react';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import { EarnFilterBar } from 'src/components/EarnFilter/EarnFilterBar';
import {
  EarnFilteringProvider,
  useEarnFiltering,
} from './EarnFilteringContext';

const EarnOpportunitiesAll_ = () => {
  const {
    totalMarkets,
    forYouLoading,
    forYou,
    allLoading,
    all,
    showForYou,
    toggleForYou,
  } = useEarnFiltering();

  const [variant, setVariant] = useState<EarnCardVariant>('compact');

  const gridSize = variant === 'compact' ? { xs: 12, sm: 4 } : { xs: 12 };

  const ForYou = () => {
    const items = AtLeastNWhenLoading(forYou, forYouLoading, 3, Infinity);
    // TODO: error management

    return (
      <div>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid key={index} size={gridSize}>
              {item == null ? (
                <EarnCard variant={variant} isLoading={true} data={null} />
              ) : (
                <EarnCard variant={variant} isLoading={false} data={item} />
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  const All = () => {
    const items = AtLeastNWhenLoading(all, allLoading, 3, Infinity);
    // TODO: error management

    return (
      <div>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid key={index} size={gridSize}>
              {item == null ? (
                <EarnCard variant={variant} isLoading={true} data={null} />
              ) : (
                <EarnCard variant={variant} isLoading={false} data={item} />
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'visible',
        marginTop: 2,
      }}
    >
      <CardContent sx={{ padding: 0 }}>
        <EarnFilterBar variant={variant} setVariant={setVariant} />
      </CardContent>
      <CardContent>{showForYou ? <ForYou /> : <All />}</CardContent>
    </Card>
  );
};

export const EarnOpportunitiesAll = () => {
  return (
    <EarnFilteringProvider>
      <EarnOpportunitiesAll_ />
    </EarnFilteringProvider>
  );
};
