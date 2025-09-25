import { FC, PropsWithChildren } from 'react';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { MultiSelectOption } from '../core/MultiSelect/MultiSelect.types';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Select } from '../core/form/Select/Select';
import { SelectVariant } from '../core/form/Select/Select.types';

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
  }));

  const protocolOptions: MultiSelectOption[] = allProtocols.map((protocol) => ({
    value: protocol.name,
    label: protocol.name,
  }));

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
    // TODO: implement
  };

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
      <Stack direction="row" gap={1} flexWrap="wrap" flex={1}>
        <Select
          options={chainOptions}
          value={filter?.chains?.map(String) ?? []}
          onChange={handleChainChange}
          filterBy="chain"
          label="Chains"
          variant={SelectVariant.Multi}
          data-testid="earn-filter-chain-select"
        />
        <Select
          options={protocolOptions}
          value={filter?.protocols || []}
          onChange={handleProtocolChange}
          filterBy="protocol"
          label="Protocols"
          variant={SelectVariant.Multi}
          data-testid="earn-filter-protocol-select"
        />

        <Select
          options={tagOptions}
          value={filter?.tags || []}
          onChange={handleTagChange}
          filterBy="tag"
          label="Tags"
          variant={SelectVariant.Multi}
          data-testid="earn-filter-tag-select"
        />

        <Select
          options={assetOptions}
          value={filter?.assets || []}
          onChange={handleAssetChange}
          filterBy="asset"
          label="Assets"
          variant={SelectVariant.Multi}
          data-testid="earn-filter-asset-select"
        />

        <Select
          options={[]}
          value={[]} // TODO: implement
          min={apyMin}
          max={apyMax}
          onChange={handleAPYChange}
          label="APY"
          variant={SelectVariant.Slider}
          data-testid="earn-filter-apy-select"
        />
      </Stack>

      {children}
    </Box>
  );
};
