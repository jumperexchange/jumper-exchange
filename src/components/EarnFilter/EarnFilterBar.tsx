import { Box } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { MultiSelect } from '../core/MultiSelect/MultiSelect';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
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
    usedYourAddress,
  } = useEarnFiltering();

  const tabOptions: TabOption[] = [
    { value: 'foryou', label: 'For You' },
    { value: 'all', label: 'All' },
  ];

  const handleTabChange = (value: string) => {
    toggleForYou();
  };

  const ForYou = () => {
    const formatedTotalMarkets = totalMarkets.toLocaleString();

    const copy = usedYourAddress
      ? t('earn.copy.forYouBasedOnActivity', {
          totalMarkets: formatedTotalMarkets,
        })
      : t('earn.copy.forYouDefault', { totalMarkets: formatedTotalMarkets });

    // TODO: add latest update in backend and render here

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        {/* Left side: Badge and copy */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Badge
            variant={BadgeVariant.Primary}
            size={BadgeSize.SM}
            startIcon={<RecommendationIcon height={12} width={12} />}
          />
          <Box>{copy}</Box>
        </Box>

        {/* Right side: List mode */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <EarnListMode variant={variant} setVariant={setVariant} />
        </Box>
      </Box>
    );
  };

  const All = () => {
    // Convert data to MultiSelect options
    const chainOptions: MultiSelectOption[] = allChains.map((chain) => ({
      value: chain.chainKey,
      label: chain.chainKey,
    }));

    const protocolOptions: MultiSelectOption[] = allProtocols.map(
      (protocol) => ({
        value: protocol.name,
        label: protocol.name,
      }),
    );

    const tagOptions: MultiSelectOption[] = allTags.map((tag) => ({
      value: tag,
      label: tag,
    }));

    const assetOptions: MultiSelectOption[] = allAssets.map((asset) => ({
      value: asset.name,
      label: asset.name,
    }));

    const apyOptions: MultiSelectOption[] = Object.entries(allAPY).map(
      ([key, value]) => ({
        value: key,
        label: `${key}: ${value}`,
      }),
    );

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: 1,
          }}
        >
          <MultiSelect
            options={chainOptions}
            value={[]}
            placeholder="Chains"
            label="Chains"
            size="small"
            show="chips"
            maxChips={2}
          />

          <MultiSelect
            options={protocolOptions}
            value={[]}
            placeholder="Protocols"
            label="Protocols"
            size="small"
            show="chips"
            maxChips={2}
          />

          <MultiSelect
            options={tagOptions}
            value={[]}
            placeholder="Tags"
            label="Tags"
            size="small"
            show="chips"
            maxChips={2}
          />

          <MultiSelect
            options={assetOptions}
            value={[]}
            placeholder="Assets"
            label="Assets"
            size="small"
            show="chips"
            maxChips={2}
          />

          <MultiSelect
            options={apyOptions}
            value={[]}
            placeholder="APY"
            label="APY"
            size="small"
            show="chips"
            maxChips={2}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <EarnListMode variant={variant} setVariant={setVariant} />
          <EarnFilterSort sortBy={sortBy} setSortBy={setSortBy} />
        </Box>
      </Box>
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
