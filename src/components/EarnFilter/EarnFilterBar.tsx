import { Box } from '@mui/system';
import { useState } from 'react';
import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { TabSelect } from '../core/TabSelect/TabSelect';
import { TabOption } from '../core/TabSelect/TabSelect.types';
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

  const tabOptions: TabOption[] = [
    { value: 'all', label: 'All' },
    { value: 'foryou', label: 'For You' },
  ];

  const handleTabChange = (value: string) => {
    toggleForYou();
  };

  const ForYou = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box>Hello world</Box>
        <EarnListMode variant={variant} setVariant={setVariant} />
      </Box>
    );
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
      <TabSelect
        options={tabOptions}
        value={showForYou ? 'foryou' : 'all'}
        onChange={handleTabChange}
        variant="standard"
        size="medium"
      />
      {showForYou ? <ForYou /> : <All />}
    </EarnFilterBarContainer>
  );
};
