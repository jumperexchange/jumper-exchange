'use client';
import { Grid } from '@mui/material';
import { EarnCard } from 'src/components/Cards/EarnCard/EarnCard';
import { AtLeastNWhenLoading } from 'src/components/Cards/EarnCard/variants/shared';
import { EarnFilter } from './EarnFilter';
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

  const formatedTotalMarkets = totalMarkets.toLocaleString();

  const ForYou = () => {
    const items = AtLeastNWhenLoading(forYou, forYouLoading, 3, Infinity);
    // TODO: error management

    return (
      <div>
        <h1>For You</h1>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              {item == null ? (
                <EarnCard variant="compact" isLoading={true} data={null} />
              ) : (
                <EarnCard variant="compact" isLoading={false} data={item} />
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
        <h1>All</h1>
        <EarnFilter />
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4 }}>
              {item == null ? (
                <EarnCard variant="compact" isLoading={true} data={null} />
              ) : (
                <EarnCard variant="compact" isLoading={false} data={item} />
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <div>
      <h1>Markets</h1>
      <p>
        Explore curated and comprehensive ways to put your assets to work across{' '}
        {formatedTotalMarkets}+ markets
      </p>
      <button onClick={toggleForYou}>
        {showForYou ? 'Show All' : 'Show For You'}
      </button>
      {showForYou ? <ForYou /> : <All />}
    </div>
  );
};

export const EarnOpportunitiesAll = () => {
  return (
    <EarnFilteringProvider>
      <EarnOpportunitiesAll_ />
    </EarnFilteringProvider>
  );
};
