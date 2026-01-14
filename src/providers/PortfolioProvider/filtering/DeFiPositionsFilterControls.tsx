/**
 * @deprecated use the PortfolioFilterBar component instead
 */
'use client';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  OutlinedInput,
  Typography,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useDeFiPositionsFiltering } from './DeFiPositionsFilteringContext';
import { SortByOptions } from '@/app/ui/portfolio/types';

export const DeFiPositionsFilterControls = () => {
  const {
    filter,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    allChains,
    allProtocols,
    allTypes,
    allAssets,
    allValueRange,
  } = useDeFiPositionsFiltering();

  const handleChainsChange = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    updateFilter({
      defiChains: typeof value === 'string' ? [] : value,
    });
  };

  const handleProtocolsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilter({
      defiProtocols: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleTypesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilter({
      defiTypes: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleAssetsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    updateFilter({
      defiAssets: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as typeof sortBy);
  };

  const handleMinValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : null;
    updateFilter({ defiMinValue: value });
  };

  const handleMaxValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value ? parseFloat(event.target.value) : null;
    updateFilter({ defiMaxValue: value });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {/* Chains Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Chains</InputLabel>
          <Select
            multiple
            value={filter.defiChains ?? []}
            onChange={handleChainsChange}
            input={<OutlinedInput label="Chains" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((chainId) => {
                  const chain = allChains.find((c) => c.chainId === chainId);
                  return (
                    <Chip
                      key={chainId}
                      label={chain?.chainKey || chainId}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {allChains.map((chain) => (
              <MenuItem key={chain.chainId} value={chain.chainId}>
                {chain.chainKey}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Protocols Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Protocols</InputLabel>
          <Select
            multiple
            value={filter.defiProtocols ?? []}
            onChange={handleProtocolsChange}
            input={<OutlinedInput label="Protocols" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((name) => (
                  <Chip key={name} label={name} size="small" />
                ))}
              </Box>
            )}
          >
            {allProtocols.map((protocol) => (
              <MenuItem key={protocol.name} value={protocol.name}>
                {protocol.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Types Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Types</InputLabel>
          <Select
            multiple
            value={filter.defiTypes ?? []}
            onChange={handleTypesChange}
            input={<OutlinedInput label="Types" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((type) => (
                  <Chip key={type} label={type} size="small" />
                ))}
              </Box>
            )}
          >
            {allTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Assets Filter */}
        {allAssets.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Assets</InputLabel>
            <Select
              multiple
              value={filter.defiAssets ?? []}
              onChange={handleAssetsChange}
              input={<OutlinedInput label="Assets" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((symbol) => (
                    <Chip key={symbol} label={symbol} size="small" />
                  ))}
                </Box>
              )}
            >
              {allAssets.slice(0, 50).map((asset) => (
                <MenuItem key={asset.symbol} value={asset.symbol}>
                  {asset.symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Value Range Filter */}
        <TextField
          size="small"
          label="Min Value ($)"
          type="number"
          value={filter.defiMinValue ?? ''}
          onChange={handleMinValueChange}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />
        <TextField
          size="small"
          label="Max Value ($)"
          type="number"
          value={filter.defiMaxValue ?? ''}
          onChange={handleMaxValueChange}
          sx={{ width: 120 }}
          InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        />

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={handleSortChange} label="Sort By">
            <MenuItem value={SortByOptions.VALUE}>Value</MenuItem>
            <MenuItem value={SortByOptions.CHAIN}>Chain</MenuItem>
            <MenuItem value={SortByOptions.ASSET}>Asset</MenuItem>
          </Select>
        </FormControl>

        {/* Clear Filters */}
        <Button variant="outlined" size="small" onClick={clearFilters}>
          Clear Filters
        </Button>
      </Stack>

      {/* Value Range Info */}
      {allValueRange.max > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Value range: ${allValueRange.min.toFixed(2)} - $
          {allValueRange.max.toFixed(2)}
        </Typography>
      )}
    </Box>
  );
};
