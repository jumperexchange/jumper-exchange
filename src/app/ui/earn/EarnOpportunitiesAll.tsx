'use client';

import { useEarnFiltering, withEarnFiltering } from './EarnFilteringContext';

const EarnOpportunitiesAll_ = () => {
  const {
    totalMarkets,
    forYouLoading,
    forYouError,
    forYou,
    allLoading,
    allError,
    all,
    showForYou,
    toggleForYou,
  } = useEarnFiltering();

  const formatedTotalMarkets = totalMarkets.toLocaleString();

  const ForYou = () => {
    return (
      <div>
        <h1>For You</h1>
        <pre>{forYouLoading ? 'Loading...' : 'Loaded'}</pre>
        <pre>{JSON.stringify(forYou, null, 2)}</pre>
        <pre>{forYouError ? 'Error' : 'No error'}</pre>
        <pre>{JSON.stringify(forYouError, null, 2)}</pre>
      </div>
    );
  };

  const All = () => {
    return (
      <div>
        <h1>All</h1>
        <pre>{allLoading ? 'Loading...' : 'Loaded'}</pre>
        <pre>{JSON.stringify(all, null, 2)}</pre>
        <pre>{allError ? 'Error' : 'No error'}</pre>
        <pre>{JSON.stringify(allError, null, 2)}</pre>
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

export const EarnOpportunitiesAll = withEarnFiltering(EarnOpportunitiesAll_);
