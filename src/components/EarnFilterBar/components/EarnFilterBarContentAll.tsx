import { FC, PropsWithChildren } from 'react';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { MultiSelectOption } from '../../core/MultiSelect/MultiSelect.types';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { EarnAnimatedLayoutContainer } from './EarnAnimatedLayoutContainer';
import {
  EarnFilterBarClearFiltersButton,
  EarnFilterBarContentContainer,
} from '../EarnFilterBar.styles';
import { ChainStack } from 'src/components/composite/ChainStack/ChainStack';
import { TokenStack } from 'src/components/composite/TokenStack/TokenStack';
import { AvatarStack } from 'src/components/core/AvatarStack/AvatarStack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const EarnFilterBarContentAll: FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    filter,
    updateFilter,
  } = useEarnFiltering();

  // Convert data to MultiSelect options
  const chainOptions: MultiSelectOption[] = allChains.map((chain) => ({
    value: `${chain.chainId}`,
    label: chain.chainKey,
    icon: <ChainStack chainIds={[chain.chainId.toString()]} />,
  }));

  const protocolOptions: MultiSelectOption[] = allProtocols.map((protocol) => ({
    value: protocol.name,
    label: protocol.name,
    // TODO: replace with ProtocolStack once PR #2349 gets merged
    icon: (
      <AvatarStack
        avatars={[
          { id: protocol.name, src: protocol.logo, alt: protocol.name },
        ]}
      />
    ),
  }));

  const tagOptions: MultiSelectOption[] = allTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const assetOptions: MultiSelectOption[] = allAssets.map((asset) => ({
    value: asset.name,
    label: asset.name,
    icon: <TokenStack tokens={[asset]} />,
  }));

  const apyOptions: MultiSelectOption[] = Object.entries(allAPY).map(
    ([key, value]) => ({
      value: key,
      label: `${key}: ${value}`,
    }),
  );

  const apyMin = Math.min(...Object.values(allAPY), 0);
  const apyMax = Math.max(...Object.values(allAPY), 0);

  // Handle filter changes
  const handleChainChange = (values: string[]) => {
    updateFilter({ ...filter, chains: values.map(Number) });
  };

  const handleProtocolChange = (values: string[]) => {
    updateFilter({ ...filter, protocols: values });
  };

  const handleTagChange = (values: string[]) => {
    updateFilter({ ...filter, tags: values });
  };

  const handleAssetChange = (values: string[]) => {
    updateFilter({ ...filter, assets: values });
  };

  const handleAPYChange = (values: number[]) => {
    updateFilter({
      ...filter,
      minAPY: values[0] / 100,
      maxAPY: values[1] / 100,
    });
  };

  const handleClearAllFilters = () => {
    updateFilter({
      chains: [],
      protocols: [],
      tags: [],
      assets: [],
      minAPY: apyMin,
      maxAPY: apyMax,
    });
  };

  const apyMinValue = filter?.minAPY ? filter.minAPY * 100 : apyMin;
  const apyMaxValue = filter?.maxAPY ? filter.maxAPY * 100 : apyMax;

  const hasArrayFiltersApplied = [
    filter?.chains,
    filter?.protocols,
    filter?.tags,
    filter?.assets,
  ].some((arr) => arr && arr.length > 0);

  const hasAPYFilterApplied = apyMinValue !== apyMin || apyMaxValue !== apyMax;

  const hasFilterApplied = hasArrayFiltersApplied || hasAPYFilterApplied;

  return (
    <EarnFilterBarContentContainer>
      <EarnAnimatedLayoutContainer>
        {chainOptions.length > 0 && (
          <Select
            options={chainOptions}
            value={filter?.chains?.map(String) ?? []}
            onChange={handleChainChange}
            filterBy="chain"
            label="Chains"
            variant={SelectVariant.Multi}
            data-testid="earn-filter-chain-select"
          />
        )}
        {protocolOptions.length > 0 && (
          <Select
            options={protocolOptions}
            value={filter?.protocols || []}
            onChange={handleProtocolChange}
            filterBy="protocol"
            label="Protocols"
            variant={SelectVariant.Multi}
            data-testid="earn-filter-protocol-select"
          />
        )}

        {tagOptions.length > 0 && (
          <Select
            options={tagOptions}
            value={filter?.tags || []}
            onChange={handleTagChange}
            filterBy="tag"
            label="Tags"
            variant={SelectVariant.Multi}
            data-testid="earn-filter-tag-select"
          />
        )}

        {assetOptions.length > 0 && (
          <Select
            options={assetOptions}
            value={filter?.assets || []}
            onChange={handleAssetChange}
            filterBy="asset"
            label="Assets"
            variant={SelectVariant.Multi}
            data-testid="earn-filter-asset-select"
          />
        )}

        {apyMin !== apyMax && (
          <Select
            options={[]}
            value={[apyMinValue, apyMaxValue]}
            min={apyMin}
            max={apyMax}
            onChange={handleAPYChange}
            label="APY"
            variant={SelectVariant.Slider}
            data-testid="earn-filter-apy-select"
          />
        )}

        {hasFilterApplied && (
          <EarnFilterBarClearFiltersButton
            onClick={handleClearAllFilters}
            data-testid="earn-filter-clear-filters-button"
          >
            <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
          </EarnFilterBarClearFiltersButton>
        )}
      </EarnAnimatedLayoutContainer>

      {children}
    </EarnFilterBarContentContainer>
  );
};
