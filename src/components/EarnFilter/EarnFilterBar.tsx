import { Box } from '@mui/system';
import { useState } from 'react';
import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { EarnFilterBarContainer } from './EarnFilterBar.styles';
import { EarnFilterSort, SortByOptions } from './EarnFilterSort';
import { EarnFilterTab } from './EarnFilterTab';
import { EarnListMode } from './EarnListMode';

type Props = {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
};

export const EarnFilterBar: React.FC<Props> = ({ variant, setVariant }) => {
  // TODO: introduce the loading state?
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.APY); // TODO: move to context.

  const {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    showForYou,
    toggleForYou,
  } = useEarnFiltering();

  const ForYou = () => {
    return <Box>For You</Box>;
  };

  const All = () => {
    return (
      <>
        <EarnListMode variant={variant} setVariant={setVariant} />
        <EarnFilterSort sortBy={sortBy} setSortBy={setSortBy} />
        <ul>
          <li>chains: {allChains.map((x) => x.chainKey).join(', ')}</li>
          <li>protocols: {allProtocols.map((x) => x.name).join(', ')}</li>
          <li>assets: {allAssets.map((x) => x.name).join(', ')}</li>
          <li>tags: {allTags.join(', ')}</li>
          <li>
            apy:{' '}
            {Object.entries(allAPY)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </li>
        </ul>
      </>
    );
  };

  return (
    <EarnFilterBarContainer>
      {/* <EarnFilterTab showForYou={showForYou} toggleForYou={toggleForYou} /> */}
      {showForYou ? <ForYou /> : <All />}
    </EarnFilterBarContainer>
  );
};
