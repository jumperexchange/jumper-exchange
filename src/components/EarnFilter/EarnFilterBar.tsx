import { Badge } from 'src/components/Badge/Badge';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { TabSelect } from '../core/TabSelect/TabSelect';
import { TabOption } from '../core/TabSelect/TabSelect.types';
import { RecommendationIcon } from '../illustrations/RecommendationIcon';
import { EarnFilterBarContainer } from './EarnFilterBar.styles';
import { EarnFilterSort, SortByOptions } from './EarnFilterSort';
import { EarnListMode } from './EarnListMode';

type Props = {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
};

export const EarnFilterBar: React.FC<Props> = ({ variant, setVariant }) => {
  const { t } = useTranslation();

  // TODO: introduce the loading state?
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.APY); // TODO: move to context.

  const {
    totalMarkets,
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    showForYou,
    toggleForYou,
    filter,
  } = useEarnFiltering();
  const isLoggedId = filter?.address !== undefined;

  const tabOptions: TabOption[] = [
    { value: 'all', label: 'All' },
    { value: 'foryou', label: 'For You' },
  ];

  const handleTabChange = (value: string) => {
    toggleForYou();
  };

  const ForYou = () => {
    const formatedTotalMarkets = totalMarkets.toLocaleString();

    const copy = isLoggedId
      ? t('earn.copy.forYouBasedOnActivity')
      : t('earn.copy.forYouDefault', { totalMarkets: formatedTotalMarkets });

    // TODO: add latest update in backend and render here

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Badge
          variant={BadgeVariant.Primary}
          size={BadgeSize.SM}
          startIcon={<RecommendationIcon height={12} width={12} />}
        />
        <Box>{copy}</Box>
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
